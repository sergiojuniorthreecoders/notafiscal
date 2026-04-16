import axios from "axios"

// ─────────────────────────────────────────────────────────────────────────────
// Configuração base
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = "https://conengesc167547.rm.cloudtotvs.com.br:8051"

const totvsClient = axios.create({
  baseURL: BASE_URL,
  // A API TOTVS exige que SSL seja aceito (certificado self-signed em alguns ambientes)
  // Em Node.js (Next.js server-side) pode ser necessário desativar verificação:
  // httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false })
})

// ─────────────────────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────────────────────

export interface TotvsAuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
}

export interface TotvsMovimento {
  internalId: string
  companyId: number
  movementId: number
  branchId: number
  warehouseCode: string
  customerVendorCode: string
  number: string
  series: string
  movementTypeCode: string
  type: string
  status: string
  registerDate: string
  deliveryDate: string
  grossValue: number
  netValue: number
  otherValues: number
  freightValue: number
  paymentTermCode: string
  userCode: string
  shortHistory: string
  movementItems: TotvsMovimentoItem[]
  payments: unknown[]
  costCenterApportionments: TotvsRateio[]
  [key: string]: unknown
}

export interface TotvsMovimentoItem {
  companyId: number
  movementId: number
  sequentialId: number
  productId: number
  quantity: number
  unitPrice: number
  measureUnitCode: string
  warehouseCode: string
  netValue: number
  grossValue: number
  bugdetNatureCode: string
  bugdetNatureCompanyId: number
  costCenterApportionments: TotvsRateioItem[]
  [key: string]: unknown
}

export interface TotvsRateio {
  companyId: number
  apportionmentId: number
  movementId: number
  costCenterCode: string
  percentage: number
  projectId: number
  taskId: number
  costCenterName: string
  projectCode: string
  taskCode: string
}

export interface TotvsRateioItem extends TotvsRateio {
  movementItemSequentialId: number
}

// Payload do POST de inserção de movimento
export type TotvsInserirMovimentoPayload = Record<string, unknown>

// ─────────────────────────────────────────────────────────────────────────────
// Monta o payload de entrada (recebimento) a partir de um movimento OC
//   - MovementTypeCode → "1.1.20"
//   - ApportionmentId  → 0  (TOTVS gera novos IDs)
//   - complementaryFields com os valores de avaliação da tela
//   - Quantidade de cada item conforme o que o operador informou
// ─────────────────────────────────────────────────────────────────────────────
export interface AvaliacaoEntrada {
  qualidade: string      // MOV_QUALI
  pontualidade: string   // MOV_PONT_PRD
  masso: string          // MOV_AVA_SMS
}

export function construirPayloadEntrada(
  movimento: TotvsMovimento,
  itemQuantities: Record<string, number>, // chave = ocItem.id ("idmov-item-seq")
  avaliacao: AvaliacaoEntrada
): TotvsInserirMovimentoPayload {

  // Zera ApportionmentId em um array de rateios
  const zerarRateios = (rateios: TotvsRateio[]) =>
    rateios.map((r) => ({ ...r, apportionmentId: 0, movementId: 0 }))

  const zerarRateiosItem = (rateios: TotvsRateioItem[]) =>
    rateios.map((r) => ({ ...r, apportionmentId: 0, movementId: 0 }))

  const itens = movimento.movementItems.map((item) => {
    // Mapeia a quantidade usando o padrão "idmov-item-sequentialId"
    const ocItemId = `${movimento.movementId}-item-${item.sequentialId}`
    const quantidade = itemQuantities[ocItemId] ?? item.quantity

    return {
      ...item,
      movementId: 0,
      quantity: quantidade,
      originalQuantity: quantidade,
      receivableQuantity: quantidade,
      costCenterApportionments: zerarRateiosItem(item.costCenterApportionments ?? []),
    }
  })

  return {
    ...movimento,
    movementId: 0,
    integrationId: "",
    movementTypeCode: "1.1.20",
    complementaryFields: {
      MOV_QUALI: avaliacao.qualidade,
      MOV_PONT_PRD: avaliacao.pontualidade,
      MOV_AVA_SMS: avaliacao.masso,
    },
    movementItems: itens,
    costCenterApportionments: zerarRateios(movimento.costCenterApportionments ?? []),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. AUTENTICAÇÃO
//    POST /api/connect/token  (form urlencoded)
//    Retorna access_token que deve ser enviado como "Bearer <token>" nas demais
// ─────────────────────────────────────────────────────────────────────────────

let cachedToken: string | null = null
let tokenExpiresAt = 0

export async function autenticar(): Promise<string> {
  // Reusa o token enquanto ainda for válido (com 30s de margem)
  if (cachedToken && Date.now() < tokenExpiresAt - 30_000) {
    return cachedToken
  }

  const params = new URLSearchParams()
  params.append("grant_type", "password")
  params.append("username", "hyperdata")
  params.append("password", "|mB{6=GtFE4:Bw-JwCpb")

  const response = await totvsClient.post<TotvsAuthResponse>(
    "/api/connect/token",
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      // Desativa auth padrão para este endpoint
      auth: undefined,
    }
  )

  const { access_token, expires_in } = response.data

  cachedToken = access_token
  tokenExpiresAt = Date.now() + expires_in * 1000

  return access_token
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. BUSCAR MOVIMENTO (GET)
//    GET /api/mov/v1/Movements/{internalId}
//    internalId no formato "companyId|movementId" ex: "7|12945"
// ─────────────────────────────────────────────────────────────────────────────

export async function buscarMovimento(internalId: string): Promise<TotvsMovimento> {
  const token = await autenticar()

  const response = await totvsClient.get<TotvsMovimento>(
    `/api/mov/v1/Movements/${internalId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. INSERIR MOVIMENTO (POST)
//    POST /api/mov/v1/movements
//    O payload segue a estrutura do mov_enviar.json (PascalCase)
// ─────────────────────────────────────────────────────────────────────────────

export async function inserirMovimento(
  payload: TotvsInserirMovimentoPayload
): Promise<TotvsMovimento> {
  const token = await autenticar()

  const response = await totvsClient.post<TotvsMovimento>(
    "/api/mov/v1/movements",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  )

  return response.data
}

// ─────────────────────────────────────────────────────────────────────────────
// Interceptor global de erros (log para debug)
// ─────────────────────────────────────────────────────────────────────────────

totvsClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isAxiosError(error)) {
      console.error(
        "[TOTVS API] Erro:",
        error.response?.status,
        error.response?.data ?? error.message
      )
    }
    return Promise.reject(error)
  }
)
