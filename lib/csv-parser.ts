// Utilitário server-side — parse de CSV com suporte a campos multi-linha e XML embutido
import fs from "fs"
import path from "path"
import type { NotaFiscal, NFItem, OrdemCompra, OCItem } from "./types"

// ── CSV parser (semicolon, campos com aspas e multi-linha) ──────────────────
function parseCSV(content: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ""
  let inQuotes = false

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

// ── Helpers XML (regex, sem dependência externa) ────────────────────────────
function tag(xml: string, t: string): string {
  const m = xml.match(new RegExp(`<${t}(?:\\s[^>]*)?>([^<]*)<\\/${t}>`))
  return m ? m[1].trim() : ""
}

function block(xml: string, t: string): string {
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

// ── Utilitários ─────────────────────────────────────────────────────────────
function toISO(d: string): string {
  if (!d) return ""
  const p = d.trim().split("/")
  if (p.length !== 3) return d
  return `${p[2]}-${p[1].padStart(2, "0")}-${p[0].padStart(2, "0")}`
}

function isPlaceholder(d: string) {
  return !d || d.includes("1900")
}

function formatCNPJ(c: string): string {
  c = c.replace(/\D/g, "")
  if (c.length !== 14) return c
  return c.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
}

function num(v: string): number {
  return parseFloat((v || "0").replace(",", ".")) || 0
}

function nfeStatus(s: string): NotaFiscal["status"] {
  return s === "V" ? "processada" : "pendente"
}

function ocStatus(s: string): OrdemCompra["status"] {
  const l = (s || "").toLowerCase()
  if (l.includes("cancelad")) return "cancelada"
  if (l.includes("parc")) return "parcial"
  if (l === "recebido") return "fechada"
  return "aberta"
}

// Normaliza XPED para comparar com NUMEROMOV (zero-pad numérico a 9 dígitos)
function normalizeXped(xped: string): string | undefined {
  if (!xped || xped === "0") return undefined
  const clean = xped.trim()
  if (/^\d+$/.test(clean)) return clean.padStart(9, "0")
  // Já está no formato 000000000
  if (/^0+\d+$/.test(clean)) return clean.padStart(9, "0")
  return undefined
}

// ── Carga de NF-es ──────────────────────────────────────────────────────────
export function parseNotasFiscais(filePath: string): NotaFiscal[] {
  if (!fs.existsSync(filePath)) return []
  const content = fs.readFileSync(filePath, "latin1")
  const rows = parseCSV(content)
  if (rows.length < 2) return []

  const header = rows[0]
  const idx = Object.fromEntries(header.map((h, i) => [h.trim(), i]))
  const result: NotaFiscal[] = []

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]
    if (row.length < 5) continue

    const id = row[idx["ID"]] || `nf-${r}`
    const chaveAcesso = (row[idx["CHAVEACESSO"]] || "").trim()
    const numero = row[idx["NUMERO"]] || ""
    const dataEmissao = toISO(row[idx["DATAEMISSAO"]] || "")
    const status = nfeStatus(row[idx["STATUS"]] || "")
    const xml = row[idx["XML"]] || ""

    // XPED: tenta CSV primeiro, depois XML
    const xpedCsv = (row[idx["XPED"]] || "").trim()
    const xpedXml = tag(block(xml, "compra"), "xPed")
    const ordemCompraId =
      normalizeXped(xpedCsv) || normalizeXped(xpedXml) || undefined

    // Emitente (fornecedor)
    const emitBlk = block(xml, "emit")
    const cnpj = formatCNPJ(tag(emitBlk, "CNPJ"))
    const razaoSocial = tag(emitBlk, "xNome")

    // Série
    const serie = tag(block(xml, "ide"), "serie")

    // Valor total
    const totBlk = block(xml, "ICMSTot")
    const valorTotal = num(tag(totBlk, "vNF") || tag(xml, "vNFTot"))

    // Itens
    const itens: NFItem[] = []
    let pos = 0
    let itemNum = 0
    while (true) {
      const detOpen = xml.indexOf("<det ", pos)
      if (detOpen === -1) break
      const detClose = xml.indexOf("</det>", detOpen)
      if (detClose === -1) break
      const detContent = xml.substring(detOpen, detClose + 6)
      const prodBlk = block(detContent, "prod")
      itemNum++
      itens.push({
        id: `${id}-item-${itemNum}`,
        codigo: tag(prodBlk, "cProd"),
        descricao: tag(prodBlk, "xProd"),
        quantidade: num(tag(prodBlk, "qCom")),
        unidade: tag(prodBlk, "uCom"),
        valorUnitario: num(tag(prodBlk, "vUnCom")),
        valorTotal: num(tag(prodBlk, "vProd")),
      })
      pos = detClose + 6
    }

    result.push({
      id,
      numero,
      serie,
      chaveAcesso,
      fornecedor: { cnpj, razaoSocial },
      dataEmissao,
      valorTotal,
      itens,
      status,
      ordemCompraId,
    })
  }

  return result
}

// ── Carga de Ordens de Compra ───────────────────────────────────────────────
export function parseOrdensCompra(filePath: string): OrdemCompra[] {
  if (!fs.existsSync(filePath)) return []
  const content = fs.readFileSync(filePath, "latin1")
  const rows = parseCSV(content)
  if (rows.length < 2) return []

  const header = rows[0]
  const idx = Object.fromEntries(header.map((h, i) => [h.trim(), i]))
  const ocMap = new Map<string, OrdemCompra>()

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]
    if (row.length < 10) continue

    const idmov = row[idx["IDMOV"]] || ""
    const numeromov = row[idx["NUMEROMOV"]] || ""
    const nomefantasia = row[idx["NOMEFANTASIA"]] || ""
    const descricao = row[idx["DESCRICAO"]] || ""
    const idprd = row[idx["IDPRD"]] || ""
    const numeroseq = row[idx["NUMEROSEQ"]] || String(r)
    const codund = row[idx["CODUND"]] || ""
    const statusnome = row[idx["STATUSNOME"]] || ""
    const qtdTotal = num(row[idx["QUANTIDADETOTAL"]])
    const qtdRestante = num(row[idx["QUANTIDADEITMMOV"]]) // quantidade ainda pendente
    const valUnitario = num(row[idx["VALORUNITARIO"]])
    const valLiqOrig = num(row[idx["VALORLIQUIDOORIG"]])
    const dataEmissao = toISO(row[idx["DATAEMISSAO"]] || "")
    const dataSaida = row[idx["DATASAIDA"]] || ""

    const valorUnitario =
      valUnitario > 0 ? valUnitario : qtdTotal > 0 ? valLiqOrig / qtdTotal : 0

    // QUANTIDADEITMMOV = quantidade ainda pendente de receber
    // quantidadeRecebida = total - restante
    const quantidadeRecebida = Math.max(0, qtdTotal - qtdRestante)

    const item: OCItem = {
      id: `${idmov}-item-${numeroseq}`,
      codigo: idprd,
      descricao,
      quantidadeEsperada: qtdTotal,
      quantidadeRecebida,
      unidade: codund,
      valorUnitario,
    }

    if (ocMap.has(idmov)) {
      const oc = ocMap.get(idmov)!
      oc.itens.push(item)
      oc.valorTotal += valLiqOrig
    } else {
      const dataPrevisao = isPlaceholder(dataSaida) ? dataEmissao : toISO(dataSaida)
      ocMap.set(idmov, {
        id: idmov,
        numero: numeromov,
        fornecedor: { cnpj: "", razaoSocial: nomefantasia },
        dataEmissao,
        dataPrevisao,
        status: ocStatus(statusnome),
        itens: [item],
        valorTotal: valLiqOrig,
      })
    }
  }

  return Array.from(ocMap.values())
}
