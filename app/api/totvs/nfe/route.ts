import { NextRequest, NextResponse } from "next/server"
import { autenticar } from "@/lib/totvs-api"
import type { NotaFiscal, NFItem } from "@/lib/types"

const TOTVS_BASE = "https://conengesc167547.rm.cloudtotvs.com.br:8051"

// Normaliza resposta TOTVS consultaSQL → array de objetos
function toRows(json: unknown): Record<string, string>[] {
  if (Array.isArray(json)) return json as Record<string, string>[]
  if (json && typeof json === "object") {
    const obj = json as Record<string, unknown>
    if (Array.isArray(obj["value"])) return obj["value"] as Record<string, string>[]
    if (Array.isArray(obj["items"])) return obj["items"] as Record<string, string>[]
  }
  return []
}

function tag(xml: string, t: string): string {
  const m = xml.match(new RegExp(`<${t}(?:\\s[^>]*)?>([^<]*)<\\/${t}>`))
  return m ? m[1].trim() : ""
}
function block(xml: string, t: string): string {
  const open = "<" + t, close = "</" + t + ">"
  const start = xml.indexOf(open); if (start === -1) return ""
  const tagEnd = xml.indexOf(">", start); if (tagEnd === -1) return ""
  const end = xml.indexOf(close, tagEnd); if (end === -1) return ""
  return xml.substring(start, end + close.length)
}
function num(v: string) { return parseFloat((v || "0").replace(",", ".")) || 0 }
function toISO(d: string) {
  if (!d) return ""
  const p = d.trim().split("/")
  if (p.length !== 3) return d
  return `${p[2]}-${p[1].padStart(2, "0")}-${p[0].padStart(2, "0")}`
}
function formatCNPJ(c: string) {
  c = c.replace(/\D/g, "")
  if (c.length !== 14) return c
  return c.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
}
function normalizeXped(xped: string): string | undefined {
  if (!xped || xped === "0") return undefined
  const clean = xped.trim().replace(/^0+/, "")
  if (!clean || !/^\d+$/.test(clean)) return undefined
  return clean
}

// ── GET /api/totvs/nfe?chave=XXXXX ──────────────────────────────────────────
export async function GET(request: NextRequest) {
  const chave = new URL(request.url).searchParams.get("chave")
  if (!chave) {
    return NextResponse.json({ error: "chave obrigatória" }, { status: 400 })
  }

  const token = await autenticar()
  const url = `${TOTVS_BASE}/api/framework/v1/consultaSQLServer/RealizaConsulta/HD052/0/M/?parameters=CHAVEACESSO%3D${encodeURIComponent(chave)}`
  console.log("[TOTVS NF] GET", url)

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: res.status })
  }

  const json = await res.json()
  const rows = toRows(json)
  if (rows.length === 0) {
    return NextResponse.json({ error: "NF-e não encontrada" }, { status: 404 })
  }

  const row = rows[0] // primeira (e única) NF retornada

  const id          = String(row["ID"] || `nf-${Date.now()}`)
  const numero      = String(row["NUMERO"] || "")
  const chaveAcesso = String(row["CHAVEACESSO"] || chave).trim()
  const dataEmissao = toISO(String(row["DATAEMISSAO"] || ""))
  const xml         = String(row["XML"] || "")
  const codColigada = String(row["CODCOLIGADA"] || "").trim()
  const codFilial   = String(row["CODFILIAL"] || "").trim()

  // NUMEROMOV da OC vinculada
  const xpedCsv = String(row["XPED"] || row["NUMEROMOV"] || "").trim()
  const xpedXml = tag(block(xml, "compra"), "xPed")
  const ordemCompraId = normalizeXped(xpedCsv) || normalizeXped(xpedXml)
  const numeromov = String(row["NUMEROMOV"] || ordemCompraId || "")

  // Emitente (vendedor)
  const emitBlk = block(xml, "emit")
  const cnpj = formatCNPJ(tag(emitBlk, "CNPJ"))
  const razaoSocial = tag(emitBlk, "xNome") || String(row["NOMEFANTASIA"] || "")

  // Destinatário (tomador)
  const destBlk = block(xml, "dest")
  const cnpjDest = formatCNPJ(tag(destBlk, "CNPJ") || tag(destBlk, "CPF"))
  const razaoSocialDest = tag(destBlk, "xNome")

  // Série
  const serie = tag(block(xml, "ide"), "serie") || String(row["SERIE"] || "")

  // Valor total
  const totBlk = block(xml, "ICMSTot")
  const valorTotal = num(tag(totBlk, "vNF") || tag(xml, "vNFTot") || String(row["VALORNF"] || "0"))

  // Itens do XML
  const itens: NFItem[] = []
  let pos = 0, itemNum = 0
  while (true) {
    const detOpen = xml.indexOf("<det ", pos); if (detOpen === -1) break
    const detClose = xml.indexOf("</det>", detOpen); if (detClose === -1) break
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

  const nfe: NotaFiscal = {
    id,
    numero,
    serie,
    chaveAcesso,
    fornecedor: { cnpj, razaoSocial },
    destinatario: cnpjDest ? { cnpj: cnpjDest, razaoSocial: razaoSocialDest } : undefined,
    dataEmissao,
    valorTotal,
    itens,
    status: "pendente",
    ordemCompraId,
    codColigada,
    codFilial,
    numeromov,
  }

  return NextResponse.json(nfe)
}
