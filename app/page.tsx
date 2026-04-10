"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { LoginScreen } from "@/components/login-screen"
import { AppHeader } from "@/components/app-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ScannerScreen } from "@/components/scanner-screen"
import { NFeListScreen } from "@/components/nfe-list-screen"
import { OCListScreen } from "@/components/oc-list-screen"
import { HistoricoScreen } from "@/components/historico-screen"
import { ConfigScreen } from "@/components/config-screen"
import { ValidationScreen } from "@/components/validation-screen"
import type { NotaFiscal } from "@/lib/types"

type Tab = "scanner" | "nfe" | "oc" | "historico" | "config"

export default function Home() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>("scanner")
  const [selectedNFe, setSelectedNFe] = useState<NotaFiscal | null>(null)

  if (!user) {
    return <LoginScreen />
  }

  // Se tiver uma NF-e selecionada, mostrar tela de validação
  if (selectedNFe) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="mx-auto max-w-lg">
          <ValidationScreen
            nfe={selectedNFe}
            onBack={() => setSelectedNFe(null)}
            onComplete={() => {
              setSelectedNFe(null)
              setActiveTab("scanner")
            }}
          />
        </main>
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    )
  }

  // Renderizar conteúdo baseado na tab ativa
  const renderContent = () => {
    switch (activeTab) {
      case "scanner":
        return <ScannerScreen onNFeFound={setSelectedNFe} />
      case "nfe":
        return <NFeListScreen onNFeSelect={setSelectedNFe} />
      case "oc":
        return <OCListScreen />
      case "historico":
        return <HistoricoScreen />
      case "config":
        return <ConfigScreen />
      default:
        return <ScannerScreen onNFeFound={setSelectedNFe} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-lg">
        {renderContent()}
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
