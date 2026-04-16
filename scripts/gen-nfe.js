const fs = require("fs")
const path = require("path")

function parseCSV(content) {
  const rows = []
  let row = [], cell = "", inQuotes = false
  for (let i = 0; i < content.length; i++) {
    const c = content[i]
    if (c === '"') {
      if (inQuotes && content[i + 1] === '"') { cell += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (c === ";" && !inQuotes) {
      row.push(cell); cell = ""
    } else if ((c === "\n" || c === "\r") && !inQuotes) {
      if (c === "\r" && content[i + 1] === "\n") i++
      row.push(cell); rows.push(row); row = []; cell = ""
    } else {
      cell += c
    }
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }
  return rows
}

function tag(xml, t) {
  const re = new RegExp("<" + t + "(?:\\s[^>]*)?>([^<]*)<\\/" + t + ">")
  const m = xml.match(re)
  return m ? m[1].trim() : ""
}

function block(xml, t) {
  // Use indexOf instead of regex to avoid escaping issues
  const open = "<" + t
  const close = "</" + t + ">"
  const start = xml.indexOf(open)
  if (start === -1) return ""
  // Find the end of the opening tag
  const tagEnd = xml.indexOf(">", start)
  if (tagEnd === -1) return ""
  const end = xml.indexOf(close, tagEnd)
  if (end === -1) return ""
  return xml.substring(start, end + close.length)
}

function normalizeXped(xped) {
  if (!xped || xped === "0") return undefined
  const clean = xped.trim().replace(/^0+/, "")
  if (!clean || !/^\d+$/.test(clean)) return undefined
  return clean
}

function ocStatus(s) {
  const l = (s || "").toLowerCase()
  if (l.includes("cancelad")) return "cancelada"
  if (l.includes("parc")) return "parcial"
  if (l === "recebido") return "fechada"
  return "aberta"
}

function toISO(d) {
  if (!d) return ""
  const p = d.trim().split("/")
  if (p.length !== 3) return d
  return p[2] + "-" + p[1].padStart(2, "0") + "-" + p[0].padStart(2, "0")
}

function num(v) { return parseFloat((v || "0").replace(",", ".")) || 0 }

function formatCNPJ(c) {
  c = c.replace(/\D/g, "")
  if (c.length !== 14) return c
  return c.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
}

// Parse OCs
const ocContent = fs.readFileSync("ordens_compra_20260412.CSV", "latin1")
const ocRows = parseCSV(ocContent)
const ocHeader = ocRows[0].map(h => h.trim())
const ocIdx = Object.fromEntries(ocHeader.map((h, i) => [h, i]))
const ocMap = new Map()
const ocObjects = new Map()

for (let r = 1; r < ocRows.length; r++) {
  const row = ocRows[r]
  if (row.length < 10) continue
  const codColigada = (row[0] || "").trim()
  const idmov = row[ocIdx["IDMOV"]] || ""
  const numeromov = (row[ocIdx["NUMEROMOV"]] || "").trim()
  const nomefantasia = row[ocIdx["NOMEFANTASIA"]] || ""
  const descricao = row[ocIdx["DESCRICAO"]] || ""
  const idprd = row[ocIdx["IDPRD"]] || ""
  const numeroseq = row[ocIdx["NUMEROSEQ"]] || String(r)
  const codund = row[ocIdx["CODUND"]] || ""
  const statusnome = row[ocIdx["STATUSNOME"]] || ""
  const qtdTotal = num(row[ocIdx["QUANTIDADETOTAL"]])
  const qtdRestante = num(row[ocIdx["QUANTIDADEITMMOV"]])
  const valUnitario = num(row[ocIdx["VALORUNITARIO"]])
  const valLiqOrig = num(row[ocIdx["VALORLIQUIDOORIG"]])
  const dataEmissao = toISO(row[ocIdx["DATAEMISSAO"]] || "")
  const dataSaida = row[ocIdx["DATASAIDA"]] || ""
  const valorUnitario = valUnitario > 0 ? valUnitario : qtdTotal > 0 ? valLiqOrig / qtdTotal : 0
  const quantidadeRecebida = Math.max(0, qtdTotal - qtdRestante)
  const item = { id: idmov + "-item-" + numeroseq, codigo: idprd, descricao, quantidadeEsperada: qtdTotal, quantidadeRecebida, unidade: codund, valorUnitario }

  if (ocObjects.has(idmov)) {
    const oc = ocObjects.get(idmov)
    oc.itens.push(item)
    oc.valorTotal += valLiqOrig
  } else {
    const isPlaceholder = !dataSaida || dataSaida.includes("1900")
    const dataPrevisao = isPlaceholder ? dataEmissao : toISO(dataSaida)
    ocObjects.set(idmov, { id: idmov, codColigada, numero: numeromov, fornecedor: { cnpj: "", razaoSocial: nomefantasia }, dataEmissao, dataPrevisao, status: ocStatus(statusnome), itens: [item], valorTotal: valLiqOrig })
  }
  if (!ocMap.has(numeromov)) ocMap.set(numeromov, ocStatus(statusnome))
}

const ocs = Array.from(ocObjects.values())

// Parse NF-es
const nfeContent = fs.readFileSync("tnsfeentrada_20260413.CSV", "latin1")
const nfeRows = parseCSV(nfeContent)
const nfeHeader = nfeRows[0].map(h => h.trim())
const nfeIdx = Object.fromEntries(nfeHeader.map((h, i) => [h, i]))

const nfes = []
for (let r = 1; r < nfeRows.length; r++) {
  const row = nfeRows[r]
  if (row.length < 5) continue
  const id = row[nfeIdx["ID"]] || "nf-" + r
  const chaveAcesso = (row[nfeIdx["CHAVEACESSO"]] || "").trim()
  const numero = row[nfeIdx["NUMERO"]] || ""
  if (!numero) continue
  const dataEmissao = toISO(row[nfeIdx["DATAEMISSAO"]] || "")
  const xml = row[nfeIdx["XML"]] || ""
  const xpedCsv = (row[nfeIdx["XPED"]] || "").trim()
  const xpedXml = tag(block(xml, "compra"), "xPed")
  const ordemCompraId = normalizeXped(xpedCsv) || normalizeXped(xpedXml) || undefined

  const emitBlk = block(xml, "emit")
  const cnpj = formatCNPJ(tag(emitBlk, "CNPJ"))
  const razaoSocial = tag(emitBlk, "xNome")
  const serie = tag(block(xml, "ide"), "serie")
  const totBlk = block(xml, "ICMSTot")
  const valorTotal = num(tag(totBlk, "vNF") || tag(xml, "vNFTot"))

  // Itens via indexOf (sem problemas de regex)
  const itens = []
  let pos = 0
  let itemNum = 0
  while (true) {
    const detOpen = xml.indexOf('<det ', pos)
    if (detOpen === -1) break
    const detClose = xml.indexOf('</det>', detOpen)
    if (detClose === -1) break
    const detContent = xml.substring(detOpen, detClose + 6)
    const prodBlk = block(detContent, "prod")
    itemNum++
    itens.push({
      id: id + "-item-" + itemNum,
      codigo: tag(prodBlk, "cProd"),
      descricao: tag(prodBlk, "xProd"),
      quantidade: num(tag(prodBlk, "qCom")),
      unidade: tag(prodBlk, "uCom"),
      valorUnitario: num(tag(prodBlk, "vUnCom")),
      valorTotal: num(tag(prodBlk, "vProd")),
    })
    pos = detClose + 6
  }

  const ocSt = ordemCompraId ? (ocMap.get(ordemCompraId) || null) : null
  const status = ocSt === "fechada" ? "processada" : "pendente"
  nfes.push({ id, numero, serie, chaveAcesso, fornecedor: { cnpj, razaoSocial }, dataEmissao, valorTotal, itens, status, ordemCompraId })
}

// (sem patches manuais de status — usar dados reais do CSV)

if (!fs.existsSync("data")) fs.mkdirSync("data")
fs.writeFileSync("data/nfe.json", JSON.stringify(nfes, null, 2), "utf8")
fs.writeFileSync("data/oc.json", JSON.stringify(ocs, null, 2), "utf8")

// Verificação
const sample = nfes.find(n => n.numero === "96633")
console.log("Verificação NF 96633 itens:", sample.itens.length, "itens")
sample.itens.forEach(i => console.log(" ", i.codigo, "|", i.descricao.substring(0,30), "| qtd:", i.quantidade))
console.log("")
console.log("Processadas:", nfes.filter(n => n.status === "processada").map(n => n.numero).join(", "))
console.log("Pendentes com OC:", nfes.filter(n => n.status === "pendente" && n.ordemCompraId).map(n => n.numero).join(", "))
