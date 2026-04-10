"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { APIConfig } from "./types"

const defaultConfig: APIConfig = {
  baseUrl: "https://api.erp.exemplo.com",
  endpoints: {
    consultaNFe: "/api/v1/nfe",
    consultaOC: "/api/v1/ordens-compra",
    entradaNF: "/api/v1/nfe/entrada",
  },
  auth: {
    type: "bearer",
    token: "",
  },
}

interface ConfigContextType {
  config: APIConfig
  updateConfig: (newConfig: APIConfig) => void
  isConfigured: boolean
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<APIConfig>(defaultConfig)
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    const savedConfig = localStorage.getItem("nfe_api_config")
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig) as APIConfig
        setConfig(parsed)
        setIsConfigured(true)
      } catch {
        // Usar configuração padrão se houver erro
      }
    }
  }, [])

  const updateConfig = useCallback((newConfig: APIConfig) => {
    setConfig(newConfig)
    localStorage.setItem("nfe_api_config", JSON.stringify(newConfig))
    setIsConfigured(true)
  }, [])

  return (
    <ConfigContext.Provider value={{ config, updateConfig, isConfigured }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider")
  }
  return context
}
