const fs = require("fs")

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
  const open = "<" + t
  const close = "</" + t + ">"
  const start = xml.indexOf(open)
  if (start === -1) return ""
  const tagEnd = xml.indexOf(">", start)
  if (tagEnd === -1) return ""
  const end = xml.indexOf(close, tagEnd)
  if (end === -1) return ""
  return xml.substring(start, end + close.length)
}

function normalizeXped(xped) {
  if (!xped || xped === "0") return undefined
  const clean = xped.trim()
  if (/^\d+$/.test(clean)) return clean.padStart(9, "0")
  return undefined
}

function ocStatus(s) {
  const l = (s || "").toLowerCase()
  if (l.includes("cancelad")) return "cancelada"
  if (l.includes("parc")) return "parcial"
  if (l === "recebido") return "fechada"
  return "aberta"
}

// Detecta o CSV de NF-e mais recente
const nfeFile = fs.readdirSync(".")
  .filter(f => f.toLowerCase().startsWith("tnsfeentrada") && f.toLowerCase().endsWith(".csv"))
  .sort()
  .pop()

const ocFile = fs.readdirSync(".")
  .filter(f => f.toLowerCase().startsWith("ordens_compra") && f.toLowerCase().endsWith(".csv"))
  .sort()
  .pop()

console.error("NF-e file:", nfeFile)
console.error("OC file:", ocFile)

// Parse OCs
const ocContent = fs.readFileSync(ocFile, "latin1")
const ocRows = parseCSV(ocContent)
const ocHeader = ocRows[0].map(h => h.trim())
const ocIdx = Object.fromEntries(ocHeader.map((h, i) => [h, i]))
const ocMap = new Map()

for (let r = 1; r < ocRows.length; r++) {
  const row = ocRows[r]
  if (row.length < 10) continue
  const numeromov = (row[ocIdx["NUMEROMOV"]] || "").trim()
  const statusnome = row[ocIdx["STATUSNOME"]] || ""
  if (!ocMap.has(numeromov)) ocMap.set(numeromov, ocStatus(statusnome))
}

// Parse NF-es
const nfeContent = fs.readFileSync(nfeFile, "latin1")
const nfeRows = parseCSV(nfeContent)
const nfeHeader = nfeRows[0].map(h => h.trim())
const nfeIdx = Object.fromEntries(nfeHeader.map((h, i) => [h, i]))

const results = []

for (let r = 1; r < nfeRows.length; r++) {
  const row = nfeRows[r]
  if (row.length < 5) continue
  const numero = (row[nfeIdx["NUMERO"]] || "").trim()
  if (!numero) continue
  const chaveAcesso = (row[nfeIdx["CHAVEACESSO"]] || "").trim()
  const xml = row[nfeIdx["XML"]] || ""
  const xpedCsv = (row[nfeIdx["XPED"]] || "").trim()
  const xpedXml = tag(block(xml, "compra"), "xPed")
  const ocId = normalizeXped(xpedCsv) || normalizeXped(xpedXml) || null
  const ocSt = ocId ? (ocMap.get(ocId) || "não encontrada") : "sem OC"
  const sistemaSt = ocSt === "fechada" ? "processada" : "pendente"

  results.push({ numero, ocId, ocSt, sistemaSt, chaveAcesso })
}

// Saída CSV
const csvLines = ["Nº NF;OC Vinculada;Status OC;Status Sistema;Chave de Acesso"]
for (const r of results) {
  csvLines.push([r.numero, r.ocId || "—", r.ocSt, r.sistemaSt, r.chaveAcesso].join(";"))
}

const outFile = "relatorio_nfe.csv"
fs.writeFileSync(outFile, csvLines.join("\n"), "utf8")
console.error("Arquivo gerado:", outFile, "(" + results.length + " registros)")

// Resumo no stdout
const processadas = results.filter(r => r.sistemaSt === "processada").length
const pendentes = results.filter(r => r.sistemaSt === "pendente").length
const comOC = results.filter(r => r.ocId).length
console.error("Processadas:", processadas, "| Pendentes:", pendentes, "| Com OC:", comOC, "| Sem OC:", results.length - comOC)
