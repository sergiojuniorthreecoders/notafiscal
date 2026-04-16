// Camada de persistência em JSON — server-side only
// Na primeira execução importa os CSVs automaticamente
import fs from "fs"
import path from "path"
import type { NotaFiscal, OrdemCompra, HistoricoEntry } from "./types"
import { parseNotasFiscais, parseOrdensCompra } from "./csv-parser"

const DATA_DIR = path.join(process.cwd(), "data")
const NFE_FILE = path.join(DATA_DIR, "nfe.json")
const OC_FILE = path.join(DATA_DIR, "oc.json")
const HIST_FILE = path.join(DATA_DIR, "historico.json")

const CSV_NFE = path.join(process.cwd(), "tnsfeentrada_20260413.CSV")
const CSV_OC = path.join(process.cwd(), "ordens_compra_20260412.CSV")

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function readJSON<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T
  } catch {
    return fallback
  }
}

function writeJSON(file: string, data: unknown) {
  ensureDir()
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8")
}

// ── NF-es ───────────────────────────────────────────────────────────────────

export function getNFes(): NotaFiscal[] {
  if (!fs.existsSync(NFE_FILE)) {
    const nfes = parseNotasFiscais(CSV_NFE)
    const ocs = getOCs() // usa cache após primeiro carregamento

    // Deriva status inicial da NF-e a partir da OC vinculada
    const data = nfes.map((nfe) => {
      if (!nfe.ordemCompraId) return { ...nfe, status: "pendente" as const }
      const oc = nfe.ordemCompraId ? getOCByNumero(nfe.ordemCompraId) : null
      if (!oc) return { ...nfe, status: "pendente" as const }
      // OC totalmente recebida → NF-e já conciliada
      const status = oc.status === "fechada" ? "processada" as const : "pendente" as const
      return { ...nfe, status }
    })

    writeJSON(NFE_FILE, data)
    return data
  }
  return readJSON<NotaFiscal[]>(NFE_FILE, [])
}

export function getNFeByChave(chave: string): NotaFiscal | null {
  return getNFes().find((n) => n.chaveAcesso === chave) ?? null
}

export function getNFeById(id: string): NotaFiscal | null {
  return getNFes().find((n) => n.id === id) ?? null
}

export function updateNFe(id: string, patch: Partial<NotaFiscal>): NotaFiscal | null {
  const nfes = getNFes()
  const idx = nfes.findIndex((n) => n.id === id)
  if (idx === -1) return null
  nfes[idx] = { ...nfes[idx], ...patch }
  writeJSON(NFE_FILE, nfes)
  return nfes[idx]
}

// ── Ordens de Compra ────────────────────────────────────────────────────────

export function getOCs(): OrdemCompra[] {
  if (!fs.existsSync(OC_FILE)) {
    const data = parseOrdensCompra(CSV_OC)
    writeJSON(OC_FILE, data)
    return data
  }
  return readJSON<OrdemCompra[]>(OC_FILE, [])
}

function normalizeNumero(n: string): string {
  return /^\d+$/.test(n) ? n.padStart(9, "0") : n
}

export function getOCByNumero(numero: string): OrdemCompra | null {
  const normalized = normalizeNumero(numero)
  return getOCs().find((o) => normalizeNumero(o.numero) === normalized) ?? null
}

export function getOCById(id: string): OrdemCompra | null {
  return getOCs().find((o) => o.id === id) ?? null
}

export function updateOC(id: string, patch: Partial<OrdemCompra>): OrdemCompra | null {
  const ocs = getOCs()
  const idx = ocs.findIndex((o) => o.id === id)
  if (idx === -1) return null
  ocs[idx] = { ...ocs[idx], ...patch }
  writeJSON(OC_FILE, ocs)
  return ocs[idx]
}

// ── Histórico ───────────────────────────────────────────────────────────────

export function getHistorico(): HistoricoEntry[] {
  return readJSON<HistoricoEntry[]>(HIST_FILE, [])
}

export function addHistoricoEntry(entry: Omit<HistoricoEntry, "id">): HistoricoEntry {
  const hist = getHistorico()
  const newEntry: HistoricoEntry = { ...entry, id: `hist-${Date.now()}` }
  hist.unshift(newEntry)
  writeJSON(HIST_FILE, hist)
  return newEntry
}
