"use client"

import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { ScanLine, FileText, ShoppingCart, History, Settings } from "lucide-react"

type Tab = "scanner" | "nfe" | "oc" | "historico" | "config"

interface BottomNavigationProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const { isAdmin } = useAuth()

  const tabs: { id: Tab; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
    { id: "scanner", label: "Scanner", icon: <ScanLine className="h-5 w-5" /> },
    { id: "nfe", label: "NF-e", icon: <FileText className="h-5 w-5" />, adminOnly: true  },
    { id: "oc", label: "OC", icon: <ShoppingCart className="h-5 w-5" />, adminOnly: true  },
    { id: "historico", label: "Hist.", icon: <History className="h-5 w-5" /> },
    { id: "config", label: "Config", icon: <Settings className="h-5 w-5" />, adminOnly: true },
  ]

  const visibleTabs = tabs.filter((tab) => !tab.adminOnly || isAdmin)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-area-pb">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                activeTab === tab.id && "bg-primary/10"
              )}
            >
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
