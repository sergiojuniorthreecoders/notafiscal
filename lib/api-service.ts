import type { APIConfig, NotaFiscal, OrdemCompra, HistoricoEntry } from "./types"
import { mockNotasFiscais, mockOrdensCompra, mockHistorico } from "./mock-data"

// Simular delay de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Função para gerar headers de autenticação
function getAuthHeaders(config: APIConfig): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  switch (config.auth.type) {
    case "bearer":
      if (config.auth.token) {
        headers["Authorization"] = `Bearer ${config.auth.token}`
      }
      break
    case "apikey":
      if (config.auth.apiKey && config.auth.headerName) {
        headers[config.auth.headerName] = config.auth.apiKey
      }
      break
    case "basic":
      if (config.auth.username && config.auth.password) {
        const credentials = btoa(`${config.auth.username}:${config.auth.password}`)
        headers["Authorization"] = `Basic ${credentials}`
      }
      break
  }

  return headers
}

// Mock: Buscar NF-e por chave de acesso
export async function fetchNFeByChave(
  chaveAcesso: string,
  config: APIConfig,
  useMock = true
): Promise<NotaFiscal | null> {
  await delay(800) // Simular latência

  if (useMock) {
    // Modo mock: buscar nos dados simulados
    const nfe = mockNotasFiscais.find((nf) => nf.chaveAcesso === chaveAcesso)
    return nfe || null
  }

  // Modo real: chamar API do ERP
  try {
    const response = await fetch(`${config.baseUrl}${config.endpoints.consultaNFe}/${chaveAcesso}`, {
      method: "GET",
      headers: getAuthHeaders(config),
    })

    if (!response.ok) {
      throw new Error(`Erro ao consultar NF-e: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao buscar NF-e:", error)
    throw error
  }
}

// Mock: Listar todas as NF-es
export async function fetchNFes(
  config: APIConfig,
  filters?: { dataInicio?: string; dataFim?: string; numero?: string },
  useMock = true
): Promise<NotaFiscal[]> {
  await delay(600)

  if (useMock) {
    let result = [...mockNotasFiscais]

    if (filters?.numero) {
      result = result.filter((nf) => nf.numero.includes(filters.numero!))
    }

    if (filters?.dataInicio) {
      result = result.filter((nf) => nf.dataEmissao >= filters.dataInicio!)
    }

    if (filters?.dataFim) {
      result = result.filter((nf) => nf.dataEmissao <= filters.dataFim!)
    }

    return result
  }

  try {
    const params = new URLSearchParams()
    if (filters?.dataInicio) params.append("dataInicio", filters.dataInicio)
    if (filters?.dataFim) params.append("dataFim", filters.dataFim)
    if (filters?.numero) params.append("numero", filters.numero)

    const response = await fetch(
      `${config.baseUrl}${config.endpoints.consultaNFe}?${params.toString()}`,
      {
        method: "GET",
        headers: getAuthHeaders(config),
      }
    )

    if (!response.ok) {
      throw new Error(`Erro ao listar NF-es: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao listar NF-es:", error)
    throw error
  }
}

// Mock: Buscar Ordem de Compra por ID ou NF-e
export async function fetchOCByNFe(
  nfeId: string,
  config: APIConfig,
  useMock = true
): Promise<OrdemCompra | null> {
  await delay(500)

  if (useMock) {
    const nfe = mockNotasFiscais.find((nf) => nf.id === nfeId)
    if (nfe?.ordemCompraId) {
      return mockOrdensCompra.find((oc) => oc.id === nfe.ordemCompraId) || null
    }
    return null
  }

  try {
    const response = await fetch(
      `${config.baseUrl}${config.endpoints.consultaOC}?nfeId=${nfeId}`,
      {
        method: "GET",
        headers: getAuthHeaders(config),
      }
    )

    if (!response.ok) {
      throw new Error(`Erro ao buscar OC: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao buscar OC:", error)
    throw error
  }
}

// Mock: Listar Ordens de Compra
export async function fetchOCs(
  config: APIConfig,
  filters?: { status?: string; numero?: string },
  useMock = true
): Promise<OrdemCompra[]> {
  await delay(600)

  if (useMock) {
    let result = [...mockOrdensCompra]

    if (filters?.status) {
      result = result.filter((oc) => oc.status === filters.status)
    }

    if (filters?.numero) {
      result = result.filter((oc) => oc.numero.includes(filters.numero!))
    }

    return result
  }

  try {
    const params = new URLSearchParams()
    if (filters?.status) params.append("status", filters.status)
    if (filters?.numero) params.append("numero", filters.numero)

    const response = await fetch(
      `${config.baseUrl}${config.endpoints.consultaOC}?${params.toString()}`,
      {
        method: "GET",
        headers: getAuthHeaders(config),
      }
    )

    if (!response.ok) {
      throw new Error(`Erro ao listar OCs: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao listar OCs:", error)
    throw error
  }
}

// Mock: Registrar entrada de NF-e
export async function registrarEntradaNFe(
  nfeId: string,
  config: APIConfig,
  useMock = true
): Promise<{ success: boolean; message: string }> {
  await delay(1000)

  if (useMock) {
    // Simular sucesso com 90% de chance
    const success = Math.random() > 0.1

    if (success) {
      // Atualizar status no mock (em produção seria persistido no ERP)
      const nfe = mockNotasFiscais.find((nf) => nf.id === nfeId)
      if (nfe) {
        nfe.status = "processada"
        nfe.dataRecebimento = new Date().toISOString().split("T")[0]
      }

      return {
        success: true,
        message: "Entrada registrada com sucesso no ERP",
      }
    }

    return {
      success: false,
      message: "Falha na comunicação com o ERP. Tente novamente.",
    }
  }

  try {
    const response = await fetch(`${config.baseUrl}${config.endpoints.entradaNF}`, {
      method: "POST",
      headers: getAuthHeaders(config),
      body: JSON.stringify({ nfeId }),
    })

    if (!response.ok) {
      throw new Error(`Erro ao registrar entrada: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao registrar entrada:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    }
  }
}

// Mock: Obter histórico de operações
export async function fetchHistorico(useMock = true): Promise<HistoricoEntry[]> {
  await delay(400)

  if (useMock) {
    return [...mockHistorico].sort(
      (a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
    )
  }

  // Em produção, buscar do backend
  return []
}

// Adicionar entrada ao histórico (mock)
export function addToHistorico(entry: Omit<HistoricoEntry, "id">): void {
  const newEntry: HistoricoEntry = {
    ...entry,
    id: `hist-${Date.now()}`,
  }
  mockHistorico.unshift(newEntry)
}
