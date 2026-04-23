// Tipos de usuário
export type UserRole = "admin" | "user"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

// Tipos de Nota Fiscal
export interface NFItem {
  id: string
  codigo: string
  descricao: string
  quantidade: number
  unidade: string
  valorUnitario: number
  valorTotal: number
}

export interface NotaFiscal {
  id: string
  numero: string
  serie: string
  chaveAcesso: string
  fornecedor: {
    cnpj: string
    razaoSocial: string
  }
  destinatario?: {
    cnpj: string
    razaoSocial: string
  }
  dataEmissao: string
  dataRecebimento?: string
  valorTotal: number
  itens: NFItem[]
  status: "pendente" | "processada" | "erro" | "recusada"
  ordemCompraId?: string
  codColigada?: string
  codFilial?: string
  numeromov?: string
  avaliacao?: {
    qualidade: string
    pontualidade: string
    masso: string
  }
}

// Tipos de Ordem de Compra
export interface OCItem {
  id: string
  codigo: string
  descricao: string
  quantidadeEsperada: number
  quantidadeRecebida?: number
  unidade: string
  valorUnitario: number
}

export interface OrdemCompra {
  id: string
  codColigada?: string
  numero: string
  filial?: {
    cnpj: string
    nome: string
  }
  dataEmissao: string
  dataPrevisao: string
  status: "aberta" | "parcial" | "fechada" | "cancelada"
  itens: OCItem[]
  valorTotal: number
}

// Tipos de Configuração de API
export type AuthType = "bearer" | "apikey" | "basic"

export interface APIConfig {
  baseUrl: string
  endpoints: {
    consultaNFe: string
    consultaOC: string
    entradaNF: string
  }
  auth: {
    type: AuthType
    token?: string
    apiKey?: string
    headerName?: string
    username?: string
    password?: string
  }
}

// Tipos de histórico
export interface HistoricoEntry {
  id: string
  tipo: "entrada" | "consulta" | "erro"
  notaFiscalId: string
  notaFiscalNumero: string
  fornecedor: string
  dataHora: string
  status: "sucesso" | "erro" | "pendente"
  mensagem?: string
}

// Tipos de validação
export interface ValidationResult {
  isValid: boolean
  divergencias: {
    itemId: string
    tipo: "quantidade" | "valor" | "item_nao_encontrado"
    esperado: string | number
    recebido: string | number
  }[]
}
