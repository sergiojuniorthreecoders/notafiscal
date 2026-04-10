"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { History, RefreshCw, FileText, Search, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { fetchHistorico } from "@/lib/api-service"
import type { HistoricoEntry } from "@/lib/types"

export function HistoricoScreen() {
  const [historico, setHistorico] = useState<HistoricoEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadHistorico = async () => {
    setIsLoading(true)
    try {
      const data = await fetchHistorico(true)
      setHistorico(data)
    } catch (error) {
      console.error("Erro ao carregar histórico:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadHistorico()
  }, [])

  const getTypeIcon = (tipo: HistoricoEntry["tipo"]) => {
    switch (tipo) {
      case "entrada":
        return <CheckCircle2 className="h-5 w-5 text-success" />
      case "consulta":
        return <Search className="h-5 w-5 text-primary" />
      case "erro":
        return <AlertCircle className="h-5 w-5 text-destructive" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: HistoricoEntry["status"]) => {
    switch (status) {
      case "sucesso":
        return <Badge variant="outline" className="bg-success/10 text-success border-success/30">Sucesso</Badge>
      case "erro":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">Erro</Badge>
      case "pendente":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">Pendente</Badge>
      default:
        return null
    }
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return {
      date: date.toLocaleDateString("pt-BR"),
      time: date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const getTipoLabel = (tipo: HistoricoEntry["tipo"]) => {
    switch (tipo) {
      case "entrada":
        return "Entrada de NF"
      case "consulta":
        return "Consulta"
      case "erro":
        return "Erro"
      default:
        return tipo
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Histórico</h2>
          <p className="text-sm text-muted-foreground">
            Últimas {historico.length} operações
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={loadHistorico} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      ) : historico.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <History className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Nenhuma operação registrada</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {historico.map((entry) => {
            const { date, time } = formatDateTime(entry.dataHora)
            return (
              <Card key={entry.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted flex-shrink-0">
                      {getTypeIcon(entry.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold">{getTipoLabel(entry.tipo)}</span>
                        {getStatusBadge(entry.status)}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">NF-e {entry.notaFiscalNumero}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {entry.fornecedor}
                      </p>
                      {entry.mensagem && (
                        <p className={`text-xs mt-2 ${
                          entry.status === "erro" ? "text-destructive" : "text-muted-foreground"
                        }`}>
                          {entry.mensagem}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {date} às {time}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
