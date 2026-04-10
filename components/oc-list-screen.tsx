"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, ShoppingCart, ChevronRight, RefreshCw, Package } from "lucide-react"
import { useConfig } from "@/lib/config-context"
import { fetchOCs } from "@/lib/api-service"
import type { OrdemCompra } from "@/lib/types"

interface OCListScreenProps {
  onOCSelect?: (oc: OrdemCompra) => void
}

export function OCListScreen({ onOCSelect }: OCListScreenProps) {
  const { config } = useConfig()
  const [ocs, setOCs] = useState<OrdemCompra[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todas")
  const [selectedOC, setSelectedOC] = useState<OrdemCompra | null>(null)

  const loadOCs = async () => {
    setIsLoading(true)
    try {
      const filters: { numero?: string; status?: string } = {}
      if (searchTerm) filters.numero = searchTerm
      if (statusFilter !== "todas") filters.status = statusFilter

      const data = await fetchOCs(config, filters, true)
      setOCs(data)
    } catch (error) {
      console.error("Erro ao carregar OCs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOCs()
  }, [statusFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadOCs()
  }

  const getStatusBadge = (status: OrdemCompra["status"]) => {
    switch (status) {
      case "aberta":
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">Aberta</Badge>
      case "parcial":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">Parcial</Badge>
      case "fechada":
        return <Badge variant="outline" className="bg-success/10 text-success border-success/30">Fechada</Badge>
      case "cancelada":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">Cancelada</Badge>
      default:
        return null
    }
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

  const handleOCClick = (oc: OrdemCompra) => {
    if (onOCSelect) {
      onOCSelect(oc)
    } else {
      setSelectedOC(selectedOC?.id === oc.id ? null : oc)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Ordens de Compra</h2>
          <p className="text-sm text-muted-foreground">
            {ocs.length} ordem{ocs.length !== 1 ? "ns" : ""} encontrada{ocs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={loadOCs} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Busca */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por número"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-12 w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            <SelectItem value="aberta">Abertas</SelectItem>
            <SelectItem value="parcial">Parciais</SelectItem>
            <SelectItem value="fechada">Fechadas</SelectItem>
            <SelectItem value="cancelada">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </form>

      {/* Lista */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      ) : ocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Nenhuma OC encontrada</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {ocs.map((oc) => (
            <Card
              key={oc.id}
              className={`cursor-pointer transition-colors ${
                selectedOC?.id === oc.id
                  ? "ring-2 ring-primary"
                  : "hover:bg-accent/50 active:bg-accent"
              }`}
              onClick={() => handleOCClick(oc)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg">{oc.numero}</span>
                      {getStatusBadge(oc.status)}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {oc.fornecedor.razaoSocial}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-muted-foreground">
                        Prev: {formatDate(oc.dataPrevisao)}
                      </span>
                      <span className="font-semibold text-primary">
                        {formatCurrency(oc.valorTotal)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {oc.itens.length} ite{oc.itens.length !== 1 ? "ns" : "m"}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>

                {/* Detalhes expandidos */}
                {selectedOC?.id === oc.id && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Itens da Ordem
                    </h4>
                    <div className="space-y-2">
                      {oc.itens.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-sm bg-muted/50 rounded-lg p-2"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">{item.descricao}</p>
                            <p className="text-xs text-muted-foreground">{item.codigo}</p>
                          </div>
                          <div className="text-right ml-2">
                            <p className="font-semibold">
                              {item.quantidadeEsperada} {item.unidade}
                            </p>
                            {item.quantidadeRecebida !== undefined && (
                              <p className="text-xs text-success">
                                Recebido: {item.quantidadeRecebida}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
