"use client"

import { useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { ScanLine, Camera, Keyboard, AlertCircle, CheckCircle2 } from "lucide-react"
import { useConfig } from "@/lib/config-context"
import { fetchNFeByChave } from "@/lib/api-service"
import type { NotaFiscal } from "@/lib/types"

// Carregado apenas no cliente — evita SSR e HMR stale do import dinâmico
const BarcodeReader = dynamic(
  () => import("./barcode-reader").then((m) => m.BarcodeReader),
  { ssr: false }
)

interface ScannerScreenProps {
  onNFeFound: (nfe: NotaFiscal) => void
}

function extrairChaveAcesso(texto: string): string | null {
  const match = texto.replace(/\D/g, "").match(/\d{44}/)
  return match ? match[0] : null
}

export function ScannerScreen({ onNFeFound }: ScannerScreenProps) {
  const { config } = useConfig()
  const [mode, setMode] = useState<"camera" | "manual">("camera")
  const [cameraActive, setCameraActive] = useState(true)
  const [manualKey, setManualKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const lastCodeRef = { current: "" }

  const handleKeySearch = useCallback(async (chave: string) => {
    if (!chave || chave.length < 44) {
      setError("Chave de acesso inválida. Deve conter 44 dígitos.")
      return
    }

    setIsLoading(true)
    setCameraActive(false)
    setError("")
    setSuccess("")

    try {
      const nfe = await fetchNFeByChave(chave, config, true)
      if (nfe) {
        setSuccess(`NF-e ${nfe.numero} encontrada!`)
        setTimeout(() => onNFeFound(nfe), 500)
      } else {
        setError("Nota Fiscal não encontrada no sistema")
        setCameraActive(true)
      }
    } catch {
      setError("Erro ao consultar NF-e. Tente novamente.")
      setCameraActive(true)
    } finally {
      setIsLoading(false)
    }
  }, [config, onNFeFound])

  const handleDetected = useCallback((code: string) => {
    if (code === lastCodeRef.current) return
    lastCodeRef.current = code
    const chave = extrairChaveAcesso(code)
    if (chave) handleKeySearch(chave)
    // reset dedup após 3s para permitir nova leitura se erro
    setTimeout(() => { lastCodeRef.current = "" }, 3000)
  }, [handleKeySearch])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleKeySearch(manualKey.replace(/\D/g, ""))
  }

  const switchMode = (newMode: "camera" | "manual") => {
    setMode(newMode)
    setCameraActive(newMode === "camera")
    setError("")
    setSuccess("")
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div className="text-center">
        <h2 className="text-xl font-bold">Escanear Nota Fiscal</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Aponte a câmera para o código de barras ou QR Code da NF-e
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant={mode === "camera" ? "default" : "outline"}
          className="flex-1 h-12"
          onClick={() => switchMode("camera")}
        >
          <Camera className="mr-2 h-5 w-5" />
          Câmera
        </Button>
        <Button
          variant={mode === "manual" ? "default" : "outline"}
          className="flex-1 h-12"
          onClick={() => switchMode("manual")}
        >
          <Keyboard className="mr-2 h-5 w-5" />
          Manual
        </Button>
      </div>

      {mode === "camera" ? (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
              <BarcodeReader
                active={cameraActive}
                onDetected={handleDetected}
                onError={(msg) => setError(msg)}
              />

              {/* Guia de alinhamento horizontal */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-4/5 h-24 border-2 border-primary rounded-lg opacity-80">
                  {cameraActive && (
                    <div className="absolute inset-x-0 h-0.5 bg-primary animate-scan" />
                  )}
                </div>
              </div>

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <div className="flex flex-col items-center gap-2">
                    <Spinner className="h-8 w-8" />
                    <span className="text-sm font-medium">Consultando NF-e...</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Chave de Acesso (44 dígitos)
                </label>
                <Input
                  type="text"
                  placeholder="Digite ou cole a chave de acesso"
                  value={manualKey}
                  onChange={(e) => setManualKey(e.target.value)}
                  className="h-14 text-base font-mono"
                  maxLength={54}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {manualKey.replace(/\D/g, "").length}/44 dígitos
                </p>
              </div>
              <Button
                type="submit"
                className="h-14 text-lg font-semibold"
                disabled={isLoading || manualKey.replace(/\D/g, "").length < 44}
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Consultando...
                  </>
                ) : (
                  <>
                    <ScanLine className="mr-2 h-5 w-5" />
                    Buscar NF-e
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {mode === "camera" && !isLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ScanLine className="h-4 w-4 animate-pulse text-primary" />
          <span>Aguardando leitura do código de barras...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-6 w-6 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-xl bg-green-500/10 p-4 text-green-600">
          <CheckCircle2 className="h-6 w-6 flex-shrink-0" />
          <span className="font-medium">{success}</span>
        </div>
      )}

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Dicas de leitura</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Centralize o código de barras na área destacada</li>
            <li>• Mantenha o celular horizontal (paisagem)</li>
            <li>• Aproxime até o código preencher a área</li>
            <li>• Boa iluminação, sem reflexo no papel</li>
          </ul>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-20px); }
          50% { transform: translateY(110px); }
        }
        .animate-scan {
          animation: scan 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
