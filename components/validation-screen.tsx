"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Checkbox } from "@/components/ui/checkbox"
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
import { fetchOCByNFe, registrarEntradaNFe, addToHistorico } from "@/lib/api-service"
import type { NotaFiscal, OrdemCompra, NFItem, OCItem } from "@/lib/types"

interface ValidationScreenProps {
  nfe: NotaFiscal
  onBack: () => void
  onComplete: () => void
}

interface ItemComparison {
  nfItem: NFItem
  ocItem: OCItem | null
  match: boolean
  quantityMatch: boolean
}

export function ValidationScreen({ nfe, onBack, onComplete }: ValidationScreenProps) {
  const { config } = useConfig()
  const [oc, setOC] = useState<OrdemCompra | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [itemsChecked, setItemsChecked] = useState<Set<string>>(new Set())
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [comparisons, setComparisons] = useState<ItemComparison[]>([])
  const [avaliacaoQualidade, setAvaliacaoQualidade] = useState<string>("")
  const [avaliacaoPontualidade, setAvaliacaoPontualidade] = useState<string>("")
  const [avaliacaoMASSO, setAvaliacaoMASSO] = useState<string>("")

  useEffect(() => {
    loadOC()
  }, [nfe])

  const loadOC = async () => {
    setIsLoading(true)
    try {
      const data = await fetchOCByNFe(nfe.id, config, true)
      setOC(data)
      
      // Criar comparações de itens
      if (data) {
        const comps: ItemComparison[] = nfe.itens.map((nfItem) => {
          const ocItem = data.itens.find((oci) => oci.codigo === nfItem.codigo)
          return {
            nfItem,
            ocItem: ocItem || null,
            match: !!ocItem,
            quantityMatch: ocItem ? ocItem.quantidadeEsperada === nfItem.quantidade : false,
          }
        })
        setComparisons(comps)
      }
    } catch (error) {
      console.error("Erro ao carregar OC:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleItem = (itemId: string) => {
    const newChecked = new Set(itemsChecked)
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId)
    } else {
      newChecked.add(itemId)
    }
    setItemsChecked(newChecked)
  }

  const allItemsChecked = itemsChecked.size === nfe.itens.length

  const handleAccept = async () => {
    setShowConfirmDialog(false)
    setIsSubmitting(true)

    try {
      const response = await registrarEntradaNFe(nfe.id, config, true)
      setResult(response)

      // Adicionar ao histórico
      addToHistorico({
        tipo: response.success ? "entrada" : "erro",
        notaFiscalId: nfe.id,
        notaFiscalNumero: nfe.numero,
        fornecedor: nfe.fornecedor.razaoSocial,
        dataHora: new Date().toISOString(),
        status: response.success ? "sucesso" : "erro",
        mensagem: response.message,
      })

      if (response.success) {
        setTimeout(() => {
          onComplete()
        }, 2000)
      }
    } catch {
      setResult({
        success: false,
        message: "Erro inesperado ao processar entrada",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = () => {
    setShowRejectDialog(false)
    
    // Adicionar ao histórico
    addToHistorico({
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR")
  }

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

  // Tela de resultado
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
        <p className="text-center text-muted-foreground mb-6">
          {result.message}
        </p>
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
              <span className="text-muted-foreground">Itens Esperados</span>
              <span className="font-medium">{oc.itens.length}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de itens para conferência */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Itens ({nfe.itens.length})</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (allItemsChecked) {
                  setItemsChecked(new Set())
                } else {
                  setItemsChecked(new Set(nfe.itens.map((i) => i.id)))
                }
              }}
            >
              {allItemsChecked ? "Desmarcar" : "Marcar"} Todos
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {comparisons.map(({ nfItem, ocItem, match, quantityMatch }) => (
            <div
              key={nfItem.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                itemsChecked.has(nfItem.id)
                  ? "bg-success/5 border-success/30"
                  : "bg-muted/30 border-transparent"
              }`}
              onClick={() => toggleItem(nfItem.id)}
            >
              <Checkbox
                checked={itemsChecked.has(nfItem.id)}
                onCheckedChange={() => toggleItem(nfItem.id)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{nfItem.descricao}</p>
                    <p className="text-xs text-muted-foreground">{nfItem.codigo}</p>
                  </div>
                  {!match && (
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Divergente
                    </Badge>
                  )}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">NF-e</span>
                    <span className="font-semibold">{nfItem.quantidade} {nfItem.unidade}</span>
                  </div>
                  {ocItem && (
                    <div>
                      <span className="text-xs text-muted-foreground block">OC Esperado</span>
                      <span className={`font-semibold ${
                        quantityMatch ? "text-success" : "text-warning"
                      }`}>
                        {ocItem.quantidadeEsperada} {ocItem.unidade}
                        {quantityMatch ? (
                          <Check className="h-3 w-3 inline ml-1" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 inline ml-1" />
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

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
              <Select value={value} onValueChange={onChange}>
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
          <Button
            variant="destructive"
            className="flex-1 h-14 text-lg font-semibold"
            onClick={() => setShowRejectDialog(true)}
            disabled={isSubmitting}
          >
            <X className="mr-2 h-5 w-5" />
            Recusar
          </Button>
          <Button
            className="flex-1 h-14 text-lg font-semibold"
            onClick={() => setShowConfirmDialog(true)}
            disabled={isSubmitting || !allItemsChecked || !avaliacaoQualidade || !avaliacaoPontualidade || !avaliacaoMASSO}
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
        </div>
        {(!allItemsChecked || !avaliacaoQualidade || !avaliacaoPontualidade || !avaliacaoMASSO) && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            {!allItemsChecked
              ? "Marque todos os itens para confirmar a entrada"
              : "Preencha todas as avaliações para confirmar a entrada"}
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
