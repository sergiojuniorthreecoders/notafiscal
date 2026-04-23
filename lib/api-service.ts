import type { APIConfig, NotaFiscal, OrdemCompra, HistoricoEntry } from "./types"

// ── NF-e ────────────────────────────────────────────────────────────────────

export async function fetchNFeByChave(
  chaveAcesso: string,
  _config?: APIConfig,
  _useMock?: boolean
): Promise<NotaFiscal | null> {
  // Busca NF-e diretamente na API TOTVS (HD052)
  const res = await fetch(`/api/totvs/nfe?chave=${encodeURIComponent(chaveAcesso)}`)
  if (!res.ok) return null
  return res.json()
}

export async function fetchNFes(
  _config?: APIConfig,
  filters?: { dataInicio?: string; dataFim?: string; numero?: string },
  _useMock?: boolean
): Promise<NotaFiscal[]> {
  const res = await fetch("/api/nfe")
  if (!res.ok) return []
  const all: NotaFiscal[] = await res.json()

  let result = all
  if (filters?.numero)
    result = result.filter((n) => n.numero.includes(filters.numero!))
  if (filters?.dataInicio)
    result = result.filter((n) => n.dataEmissao >= filters.dataInicio!)
  if (filters?.dataFim)
    result = result.filter((n) => n.dataEmissao <= filters.dataFim!)

  return result
}

export async function updateNFeStatus(
  id: string,
  patch: Partial<NotaFiscal>
): Promise<NotaFiscal | null> {
  const res = await fetch(`/api/nfe?id=${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  })
  if (!res.ok) return null
  return res.json()
}

// ── Ordens de Compra ────────────────────────────────────────────────────────

export async function fetchOCByNFe(
  ordemCompraNumero: string,
  _config?: APIConfig,
  _useMock?: boolean
): Promise<OrdemCompra | null> {
  if (!ordemCompraNumero) return null
  const res = await fetch(`/api/oc?numero=${encodeURIComponent(ordemCompraNumero)}`)
  if (!res.ok) return null
  return res.json()
}

// Busca OC diretamente na API TOTVS (HD053)
export async function fetchOCFromTotvs(
  codColigada: string,
  codFilial: string,
  numeromov: string
): Promise<OrdemCompra | null> {
  if (!codColigada || !codFilial || !numeromov) return null
  const res = await fetch(
    `/api/totvs/oc?codColigada=${encodeURIComponent(codColigada)}&codFilial=${encodeURIComponent(codFilial)}&numeromov=${encodeURIComponent(numeromov)}`
  )
  if (!res.ok) return null
  return res.json()
}

export async function fetchOCs(
  _config?: APIConfig,
  filters?: { status?: string; numero?: string },
  _useMock?: boolean
): Promise<OrdemCompra[]> {
  const res = await fetch("/api/oc")
  if (!res.ok) return []
  const all: OrdemCompra[] = await res.json()

  let result = all
  if (filters?.status) result = result.filter((o) => o.status === filters.status)
  if (filters?.numero) result = result.filter((o) => o.numero.includes(filters.numero!))

  return result
}

export async function updateOCItems(
  ocId: string,
  patch: Partial<OrdemCompra>
): Promise<OrdemCompra | null> {
  const res = await fetch(`/api/oc?id=${encodeURIComponent(ocId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  })
  if (!res.ok) return null
  return res.json()
}

// ── Registro de Entrada ─────────────────────────────────────────────────────

export async function registrarEntradaNFe(
  nfeId: string,
  _config?: APIConfig,
  _useMock?: boolean
): Promise<{ success: boolean; message: string }> {
  const updated = await updateNFeStatus(nfeId, {
    status: "processada",
    dataRecebimento: new Date().toISOString().split("T")[0],
  })

  if (updated) {
    return { success: true, message: "Entrada registrada com sucesso" }
  }
  return { success: false, message: "Falha ao registrar entrada" }
}

// ── Histórico ───────────────────────────────────────────────────────────────

export async function fetchHistorico(_useMock?: boolean): Promise<HistoricoEntry[]> {
  const res = await fetch("/api/historico")
  if (!res.ok) return []
  return res.json()
}

export async function addToHistorico(
  entry: Omit<HistoricoEntry, "id">
): Promise<void> {
  await fetch("/api/historico", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  })
}
