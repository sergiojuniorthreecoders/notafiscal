"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  FileText,
  ShoppingCart,
  Package,
  Check,
  X,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { useConfig } from "@/lib/config-context"
import { fetchOCByNFe, registrarEntradaNFe, addToHistorico, updateNFeStatus, updateOCItems } from "@/lib/api-service"
import axios from "axios"
import { buscarMovimento } from "@/lib/totvs-api"
import type { TotvsMovimento } from "@/lib/totvs-api"
import type { NotaFiscal, OrdemCompra } from "@/lib/types"

interface ValidationScreenProps {
  nfe: NotaFiscal
  onBack: () => void
  onComplete: () => void
}

export function ValidationScreen({ nfe, onBack, onComplete }: ValidationScreenProps) {
  const { config } = useConfig()
  const [oc, setOC] = useState<OrdemCompra | null>(null)
  const [movimentoTotvs, setMovimentoTotvs] = useState<TotvsMovimento | null>(null)
  const [movimentoTotvsErro, setMovimentoTotvsErro] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  // itemQuantities: quantidade que será recebida agora para cada item da OC (chave = ocItem.id)
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({})
  const [avaliacaoQualidade, setAvaliacaoQualidade] = useState<string>(nfe.avaliacao?.qualidade ?? "")
  const [avaliacaoPontualidade, setAvaliacaoPontualidade] = useState<string>(nfe.avaliacao?.pontualidade ?? "")
  const [avaliacaoMASSO, setAvaliacaoMASSO] = useState<string>(nfe.avaliacao?.masso ?? "")

  const isReadOnly = nfe.status === "processada"

  useEffect(() => {
    loadOC()
  }, [nfe])

  const loadOC = async () => {
    setIsLoading(true)
    try {
      const data = await fetchOCByNFe(nfe.ordemCompraId || "", config, true)
      setOC(data)

      if (data) {
        // Inicializa com o restante de cada item (total - já recebido)
        const initial: Record<string, number> = {}
        for (const item of data.itens) {
          const restante = Math.max(0, item.quantidadeEsperada - (item.quantidadeRecebida ?? 0))
          initial[item.id] = restante
        }
        setItemQuantities(initial)

        // Busca o movimento no TOTVS usando CODCOLIGADA|IDMOV
        if (data.codColigada && data.id) {
          const internalId = `${data.codColigada}|${data.id}`
          try {
            const movimento = await buscarMovimento(internalId)
            setMovimentoTotvs(movimento)
            setMovimentoTotvsErro(null)
          } catch (err) {
            console.error("[TOTVS] Erro ao buscar movimento:", internalId, err)
            if (axios.isAxiosError(err)) {
              const data = err.response?.data
              const mensagem = data?.detailedMessage || data?.message || err.message
              setMovimentoTotvsErro(mensagem.trim())
            } else {
              setMovimentoTotvsErro("Erro ao buscar movimentação no TOTVS.")
            }
          }
        }
      }
    } catch (error) {
      console.error("Erro ao carregar OC:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateItemQty = (itemId: string, value: number, max: number) => {
    const clamped = Math.min(Math.max(0, value), max)
    setItemQuantities((prev) => ({ ...prev, [itemId]: clamped }))
  }

  const handleAccept = async () => {
    setShowConfirmDialog(false)
    setIsSubmitting(true)

    try {
      const response = await registrarEntradaNFe(nfe.id, config, true)

      if (response.success) {
        await updateNFeStatus(nfe.id, {
          avaliacao: {
            qualidade: avaliacaoQualidade,
            pontualidade: avaliacaoPontualidade,
            masso: avaliacaoMASSO,
          },
        })

        if (oc) {
          const updatedItems = oc.itens.map((ocItem) => {
            const qty = itemQuantities[ocItem.id] ?? 0
            const newReceived = Math.min(
              (ocItem.quantidadeRecebida ?? 0) + qty,
              ocItem.quantidadeEsperada
            )
            return { ...ocItem, quantidadeRecebida: newReceived }
          })
          const allReceived = updatedItems.every(
            (i) => (i.quantidadeRecebida ?? 0) >= i.quantidadeEsperada
          )
          await updateOCItems(oc.id, {
            itens: updatedItems,
            status: allReceived ? "fechada" : "parcial",
          })
        }
      }

      setResult(response)

      await addToHistorico({
        tipo: response.success ? "entrada" : "erro",
        notaFiscalId: nfe.id,
        notaFiscalNumero: nfe.numero,
        fornecedor: nfe.fornecedor.razaoSocial,
        dataHora: new Date().toISOString(),
        status: response.success ? "sucesso" : "erro",
        mensagem: response.message,
      })

      if (response.success) {
        setTimeout(() => onComplete(), 2000)
      }
    } catch {
      setResult({ success: false, message: "Erro inesperado ao processar entrada" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    setShowRejectDialog(false)
    await addToHistorico({
      tipo: "erro",
      notaFiscalId: nfe.id,
      notaFiscalNumero: nfe.numero,
      fornecedor: nfe.fornecedor.razaoSocial,
      dataHora: new Date().toISOString(),
      status: "erro",
      mensagem: "NF-e recusada pelo operador",
    })
    onBack()
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR")

  const avaliacaoPreenchida = !!avaliacaoQualidade && !!avaliacaoPontualidade && !!avaliacaoMASSO

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-8 w-8" />
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    )
  }

  if (result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className={`flex h-20 w-20 items-center justify-center rounded-full mb-6 ${
          result.success ? "bg-success/10" : "bg-destructive/10"
        }`}>
          {result.success ? (
            <CheckCircle2 className="h-10 w-10 text-success" />
          ) : (
            <XCircle className="h-10 w-10 text-destructive" />
          )}
        </div>
        <h2 className={`text-2xl font-bold text-center mb-2 ${
          result.success ? "text-success" : "text-destructive"
        }`}>
          {result.success ? "Entrada Registrada!" : "Falha no Registro"}
        </h2>
        <p className="text-center text-muted-foreground mb-6">{result.message}</p>
        {result.success ? (
          <p className="text-sm text-muted-foreground">Retornando ao scanner...</p>
        ) : (
          <Button onClick={() => setResult(null)} className="h-12 px-8">
            Tentar Novamente
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-48">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold">Validar NF-e</h2>
          <p className="text-sm text-muted-foreground">Confira os itens antes de confirmar</p>
        </div>
      </div>

      {/* Banner de já conciliada */}
      {isReadOnly && (
        <div className="flex items-center gap-3 rounded-xl bg-green-500/10 p-4 text-green-600 border border-green-500/20">
          <CheckCircle2 className="h-6 w-6 flex-shrink-0" />
          <div>
            <p className="font-semibold">Nota Fiscal já conciliada</p>
            {nfe.dataRecebimento && (
              <p className="text-sm opacity-80">Recebida em {formatDate(nfe.dataRecebimento)}</p>
            )}
          </div>
        </div>
      )}

      {/* Resumo da NF-e */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">NF-e {nfe.numero}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fornecedor</span>
            <span className="font-medium">{nfe.fornecedor.razaoSocial}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Data Emissão</span>
            <span className="font-medium">{formatDate(nfe.dataEmissao)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Valor Total</span>
            <span className="font-bold text-primary">{formatCurrency(nfe.valorTotal)}</span>
          </div>
        </CardContent>
      </Card>

      {/* OC vinculada */}
      {oc && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{oc.numero}</CardTitle>
              <Badge variant="outline" className="ml-auto">OC Vinculada</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Previsão</span>
              <span className="font-medium">{formatDate(oc.dataPrevisao)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium capitalize">{oc.status}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Itens da OC */}
      {oc && oc.itens.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Itens da OC ({oc.itens.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {oc.itens.map((ocItem) => {
              const recebido = ocItem.quantidadeRecebida ?? 0
              const restante = Math.max(0, ocItem.quantidadeEsperada - recebido)
              const qty = itemQuantities[ocItem.id] ?? restante
              const totalRecebidoComEsta = recebido + qty
              const completo = totalRecebidoComEsta >= ocItem.quantidadeEsperada

              return (
                <div key={ocItem.id} className="p-3 rounded-lg border bg-muted/20 space-y-3">
                  {/* Descrição e código */}
                  <div>
                    <p className="font-medium text-sm">{ocItem.descricao}</p>
                    <p className="text-xs text-muted-foreground">{ocItem.codigo} · {ocItem.unidade}</p>
                  </div>

                  {/* Progresso */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded bg-background p-2">
                      <p className="text-muted-foreground">Total OC</p>
                      <p className="font-bold text-sm">{ocItem.quantidadeEsperada}</p>
                    </div>
                    <div className="rounded bg-background p-2">
                      <p className="text-muted-foreground">Já recebido</p>
                      <p className="font-bold text-sm">{recebido}</p>
                    </div>
                    <div className="rounded bg-background p-2">
                      <p className="text-muted-foreground">Restante</p>
                      <p className={`font-bold text-sm ${restante === 0 ? "text-success" : "text-warning"}`}>
                        {restante}
                      </p>
                    </div>
                  </div>

                  {/* Campo de quantidade a receber agora */}
                  {!isReadOnly && restante > 0 && (
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground font-medium">
                        Receber agora (máx. {restante})
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={restante}
                          value={qty}
                          onChange={(e) =>
                            updateItemQty(ocItem.id, Number(e.target.value), restante)
                          }
                          className="h-10 text-center text-base font-semibold"
                        />
                        {completo && (
                          <Badge className="bg-success/10 text-success border-success/30 whitespace-nowrap">
                            <Check className="h-3 w-3 mr-1" />
                            Completo
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Leitura (já recebido completamente ou modo read-only) */}
                  {(isReadOnly || restante === 0) && (
                    <Badge className="bg-success/10 text-success border-success/30">
                      <Check className="h-3 w-3 mr-1" />
                      {restante === 0 ? "Totalmente recebido" : "Conciliado"}
                    </Badge>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Sem OC vinculada */}
      {!oc && (
        <div className="flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-destructive border border-destructive/20">
          <AlertTriangle className="h-6 w-6 flex-shrink-0" />
          <div>
            <p className="font-semibold">Sem Ordem de Compra vinculada</p>
            <p className="text-sm opacity-80">Não é possível aceitar ou recusar esta NF-e sem uma OC associada.</p>
          </div>
        </div>
      )}

      {/* Avaliação do fornecedor */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Avaliação do Fornecedor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              label: "Qualidade de serviços prestados:",
              value: avaliacaoQualidade,
              onChange: setAvaliacaoQualidade,
            },
            {
              label: "Pontualidade na entrega do produto ou serviço:",
              value: avaliacaoPontualidade,
              onChange: setAvaliacaoPontualidade,
            },
            {
              label: "Atendimento aos requisitos de Meio Ambiente (MA) e Segurança e Saúde Ocupacional (SSO):",
              value: avaliacaoMASSO,
              onChange: setAvaliacaoMASSO,
            },
          ].map(({ label, value, onChange }) => (
            <div key={label} className="space-y-2">
              <label className="text-sm font-medium leading-snug block">{label}</label>
              <Select value={value} onValueChange={onChange} disabled={isReadOnly}>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Atende</SelectItem>
                  <SelectItem value="2">Não atende</SelectItem>
                  <SelectItem value="3">Atende parcialmente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Botões de ação fixos */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent safe-area-pb">
        <div className="mx-auto max-w-lg flex gap-3">
          {isReadOnly ? (
            <Button
              variant="outline"
              className="flex-1 h-14 text-lg font-semibold"
              onClick={onBack}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>
          ) : (
            <>
              <Button
                variant="destructive"
                className="flex-1 h-14 text-lg font-semibold"
                onClick={() => setShowRejectDialog(true)}
                disabled={isSubmitting || !oc}
              >
                <X className="mr-2 h-5 w-5" />
                Recusar
              </Button>
              <Button
                className="flex-1 h-14 text-lg font-semibold"
                onClick={() => setShowConfirmDialog(true)}
                disabled={isSubmitting || !avaliacaoPreenchida || !oc || !movimentoTotvs}
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Aceitar
                  </>
                )}
              </Button>
            </>
          )}
        </div>
        {!isReadOnly && !oc && (
          <p className="text-center text-xs text-destructive mt-2">
            Vincule uma OC para habilitar as ações
          </p>
        )}
        {!isReadOnly && oc && !movimentoTotvs && movimentoTotvsErro && (
          <p className="text-center text-xs text-destructive mt-2">
            TOTVS: {movimentoTotvsErro}
          </p>
        )}
        {!isReadOnly && oc && !movimentoTotvs && !movimentoTotvsErro && (
          <p className="text-center text-xs text-destructive mt-2">
            Aguardando movimentação do TOTVS...
          </p>
        )}
        {!isReadOnly && oc && movimentoTotvs && !avaliacaoPreenchida && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            Preencha todas as avaliações para confirmar a entrada
          </p>
        )}
      </div>

      {/* Dialog de confirmação */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Entrada</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a registrar a entrada da NF-e {nfe.numero} no sistema.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleAccept}>
              Confirmar Entrada
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de recusa */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Recusar NF-e</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja recusar esta NF-e?
              O fornecedor será notificado sobre a recusa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Recusar NF-e
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
