"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Search, FileText, ChevronRight, RefreshCw, Filter } from "lucide-react"
import { useConfig } from "@/lib/config-context"
import { fetchNFes } from "@/lib/api-service"
import type { NotaFiscal } from "@/lib/types"

const PAGE_SIZE = 10

interface NFeListScreenProps {
  onNFeSelect: (nfe: NotaFiscal) => void
}

export function NFeListScreen({ onNFeSelect }: NFeListScreenProps) {
  const { config } = useConfig()
  const [allNfes, setAllNfes] = useState<NotaFiscal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filterDate, setFilterDate] = useState("")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const loadNFes = async () => {
    setIsLoading(true)
    setVisibleCount(PAGE_SIZE)
    try {
      const filters: { numero?: string; dataInicio?: string } = {}
      if (searchTerm) filters.numero = searchTerm
      if (filterDate) filters.dataInicio = filterDate

      const data = await fetchNFes(config, filters, true)
      setAllNfes(data)
    } catch (error) {
      console.error("Erro ao carregar NF-es:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadNFes()
  }, [])

  // Infinite scroll: quando o sentinel fica visível, carrega mais
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + PAGE_SIZE)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [isLoading])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadNFes()
  }

  const handleApplyFilters = () => {
    loadNFes()
  }

  const handleClearFilters = () => {
    setFilterDate("")
    setSearchTerm("")
    setVisibleCount(PAGE_SIZE)
  }

  const nfes = allNfes.slice(0, visibleCount)
  const hasMore = visibleCount < allNfes.length

  const getStatusBadge = (status: NotaFiscal["status"]) => {
    switch (status) {
      case "pendente":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">Pendente</Badge>
      case "processada":
        return <Badge variant="outline" className="bg-success/10 text-success border-success/30">Processada</Badge>
      case "erro":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">Erro</Badge>
      case "recusada":
        return <Badge variant="outline" className="bg-muted text-muted-foreground">Recusada</Badge>
      default:
        return null
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR")

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Notas Fiscais</h2>
          <p className="text-sm text-muted-foreground">
            {allNfes.length} nota{allNfes.length !== 1 ? "s" : ""} encontrada{allNfes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={loadNFes} disabled={isLoading}>
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
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-12 w-12"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </form>

      {/* Filtros expandidos */}
      {showFilters && (
        <Card>
          <CardContent className="p-3">
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Data de Emissão</label>
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleClearFilters}>
                  Limpar
                </Button>
                <Button className="flex-1" onClick={handleApplyFilters}>
                  Aplicar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      ) : allNfes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Nenhuma NF-e encontrada</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {nfes.map((nfe) => (
            <Card
              key={nfe.id}
              className="cursor-pointer transition-colors hover:bg-accent/50 active:bg-accent"
              onClick={() => onNFeSelect(nfe)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg">NF-e {nfe.numero}</span>
                      {getStatusBadge(nfe.status)}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {nfe.fornecedor.razaoSocial}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-muted-foreground">
                        {formatDate(nfe.dataEmissao)}
                      </span>
                      <span className="font-semibold text-primary">
                        {formatCurrency(nfe.valorTotal)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {nfe.itens.length} ite{nfe.itens.length !== 1 ? "ns" : "m"}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Sentinel para infinite scroll */}
          {hasMore && (
            <div ref={sentinelRef} className="flex items-center justify-center py-4">
              <Spinner className="h-5 w-5 text-muted-foreground" />
            </div>
          )}

          {!hasMore && allNfes.length > PAGE_SIZE && (
            <p className="text-center text-xs text-muted-foreground py-2">
              Mostrando todas as {allNfes.length} notas
            </p>
          )}
        </div>
      )}
    </div>
  )
}
