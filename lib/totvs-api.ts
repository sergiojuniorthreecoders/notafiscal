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
  avaliacao: AvaliacaoEntrada,
  nfeNumero: string,
  nfeChaveAcesso: string
): TotvsInserirMovimentoPayload {
  const ocMovementId = movimento.movementId
  const ocCompanyId  = movimento.companyId

  const Items = movimento.movementItems
    .map((item, idx) => {
      const ocItemId = `${ocMovementId}-item-${item.sequentialId}`
      const quantidade = itemQuantities[ocItemId] ?? item.quantity
      return { item, quantidade, idx }
    })
    .filter(({ quantidade }) => quantidade > 0)
    .map(({ item, quantidade, idx }) => ({
      CompanyId:             ocCompanyId,
      MovementId:            0,
      SequentialId:          idx + 1,
      SequentialNumber:      idx + 1,
      ProductId:             item.productId,
      Quantity:              quantidade,
      OriginalQuantity:      quantidade,
      ReceivableQuantity:    quantidade,
      UnitPrice:             item.unitPrice,
      NetValue:              item.netValue,
      GrossValue:            item.grossValue,
      MeasureUnitCode:       item.measureUnitCode,
      WarehouseCode:         item.warehouseCode,
      BugdetNatureCode:      item.bugdetNatureCode,
      BugdetNatureCompanyId: item.bugdetNatureCompanyId,
      IsSubstituteProduct:   0,
      AplicationIntegration: "M",
      complementaryFields:   {},
      CostCenterApportionments: (item.costCenterApportionments ?? []).map((r) => ({
        CompanyId:                r.companyId,
        MovementId:               0,
        MovementItemSequentialId: 0,
        ApportionmentId:          0,
        CostCenterCode:           r.costCenterCode,
        Percentage:               r.percentage,
        Value:                    0,
        ProjectId:                r.projectId,
        TaskId:                   r.taskId,
        ProjectCode:              r.projectCode,
        TaskCode:                 r.taskCode,
      })),
      ItemLots: [],
      relatedItem: [
        {
          originMovementId:                ocMovementId,
          originMovementItemSequentialId:  item.sequentialId,
          originMovementCompanyId:         ocCompanyId,
          destinyMovementId:               0,
          destinyMovementItemSequentialId: 0,
          destinyMovementCompanyId:        ocCompanyId,
          quantity:                        quantidade,
          receivedValue:                   0,
          measureUnitCode:                 item.measureUnitCode,
        },
      ],
    }))

  return {
    InternalId:              `${ocCompanyId}|0`,
    CompanyId:               ocCompanyId,
    MovementId:              0,
    BranchId:                movimento.branchId,
    WarehouseCode:           movimento.warehouseCode,
    CustomerVendorCompanyId: movimento["customerVendorCompanyId"] ?? ocCompanyId,
    CustomerVendorCode:      movimento.customerVendorCode,
    Number:                  nfeNumero,
    Series:                  "",
    MovementTypeCode:        "1.1.20",
    Status:                  movimento.status,
    AplicationIntegration:   "T",
    IntegrationId:           "",
    NFeAccesskey:            nfeChaveAcesso,
    RegisterDate:            movimento.registerDate,
    DeliveryDate:            movimento.deliveryDate,
    GrossValue:              movimento.grossValue,
    NetValue:                movimento.netValue,
    OtherValues:             movimento.otherValues,
    FreightValue:            movimento.freightValue,
    PaymentTermCode:         movimento.paymentTermCode,
    UserCode:                movimento.userCode,
    ShortHistory:            movimento.shortHistory,
    RelatedMovementId:       ocMovementId,
    UnfoldedOrderId:         ocMovementId,
    complementaryFields: {
      MOV_QUALI:    avaliacao.qualidade,
      MOV_PONT_PRD: avaliacao.pontualidade,
      MOV_AVA_SMS:  avaliacao.masso,
    },
    movementItems: Items,
    Payments: [],
    CostCenterApportionments: (movimento.costCenterApportionments ?? []).map((r) => ({
      CompanyId:       r.companyId,
      MovementId:      0,
      ApportionmentId: 0,
      CostCenterCode:  r.costCenterCode,
      Percentage:      r.percentage,
      Value:           0,
      ProjectId:       r.projectId,
      TaskId:          r.taskId,
      ProjectCode:     r.projectCode,
      TaskCode:        r.taskCode,
    })),
    relatedMovement: [
      {
        originMovementId:  ocMovementId,
        originCompanyId:   ocCompanyId,
        destinyMovementId: 0,
        destinyCompanyId:  ocCompanyId,
        relationType:      "P",
        processId:         0,
        receivedValue:     0,
      },
    ],
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
