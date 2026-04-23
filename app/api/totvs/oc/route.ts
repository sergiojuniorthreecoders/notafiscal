import { NextRequest, NextResponse } from "next/server"
import { autenticar } from "@/lib/totvs-api"
import type { OrdemCompra, OCItem } from "@/lib/types"

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

function num(v: string) { return parseFloat((v || "0").replace(",", ".")) || 0 }
function toISO(d: string) {
  if (!d) return ""
  const p = d.trim().split("/")
  if (p.length !== 3) return d
  return `${p[2]}-${p[1].padStart(2, "0")}-${p[0].padStart(2, "0")}`
}
function ocStatus(s: string): OrdemCompra["status"] {
  const l = (s || "").toLowerCase()
  if (l.includes("cancelad")) return "cancelada"
  if (l.includes("parc")) return "parcial"
  if (l === "recebido") return "fechada"
  return "aberta"
}

// ── GET /api/totvs/oc?codColigada=7&codFilial=103&numeromov=1342 ─────────────
export async function GET(request: NextRequest) {
  const params = new URL(request.url).searchParams
  const codColigada = params.get("codColigada")
  const codFilial   = params.get("codFilial")
  const numeromov   = params.get("numeromov")

  if (!codColigada || !codFilial || !numeromov) {
    return NextResponse.json(
      { error: "codColigada, codFilial e numeromov são obrigatórios" },
      { status: 400 }
    )
  }

  const token = await autenticar()
  const parameters = `CODCOLIGADA%3D${encodeURIComponent(codColigada)}%3BCODFILIAL%3D${encodeURIComponent(codFilial)}%3BNUMEROMOV%3D${encodeURIComponent(numeromov)}`
  const url = `${TOTVS_BASE}/api/framework/v1/consultaSQLServer/RealizaConsulta/HD053/0/M/?parameters=${parameters}`
  console.log("[TOTVS OC] GET", url)

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
    return NextResponse.json({ error: "OC não encontrada" }, { status: 404 })
  }

  // Agrupa todas as linhas num único OrdemCompra (uma OC pode ter vários itens)
  let oc: OrdemCompra | null = null

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r]

    const idmov       = String(row["IDMOV"] || numeromov)
    const numeromovR  = String(row["NUMEROMOV"] || numeromov)
    const nomefantasia= String(row["NOMEFANTASIA"] || "")
    const descricao   = String(row["DESCRICAO"] || "")
    const idprd       = String(row["IDPRD"] || "")
    const numeroseq   = String(row["NUMEROSEQ"] || r + 1)
    const codund      = String(row["CODUND"] || "")
    const statusnome  = String(row["STATUSNOME"] || "")
    const qtdTotal    = num(String(row["QUANTIDADETOTAL"] || "0"))
    const qtdRestante = num(String(row["QUANTIDADEITMMOV"] || "0"))
    const valUnitario = num(String(row["VALORUNITARIO"] || "0"))
    const valLiqOrig  = num(String(row["VALORLIQUIDOORIG"] || "0"))
    const dataEmissao = toISO(String(row["DATAEMISSAO"] || ""))
    const dataSaida   = String(row["DATASAIDA"] || "")
    const codColigadaR= String(row["CODCOLIGADA"] || codColigada).trim()
    const cnpjFilial  = String(row["CNPJFILIAL"] || "").trim()
    const nomeFilial  = String(row["NOMEFILIAL"] || "").trim()

    const valorUnitarioCalc = valUnitario > 0 ? valUnitario : qtdTotal > 0 ? valLiqOrig / qtdTotal : 0
    const quantidadeRecebida = Math.max(0, qtdTotal - qtdRestante)

    const item: OCItem = {
      id: `${idmov}-item-${numeroseq}`,
      codigo: idprd,
      descricao,
      quantidadeEsperada: qtdTotal,
      quantidadeRecebida,
      unidade: codund,
      valorUnitario: valorUnitarioCalc,
    }

    if (!oc) {
      const isPlaceholder = !dataSaida || dataSaida.includes("1900")
      oc = {
        id: idmov,
        codColigada: codColigadaR,
        numero: numeromovR,
        filial: cnpjFilial || nomeFilial ? { cnpj: cnpjFilial, nome: nomeFilial } : undefined,
        dataEmissao,
        dataPrevisao: isPlaceholder ? dataEmissao : toISO(dataSaida),
        status: ocStatus(statusnome),
        itens: [item],
        valorTotal: valLiqOrig,
      }
    } else {
      oc.itens.push(item)
      oc.valorTotal += valLiqOrig
    }
  }

  if (!oc) {
    return NextResponse.json({ error: "OC não encontrada" }, { status: 404 })
  }

  return NextResponse.json(oc)
}
