"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
  Settings,
  Server,
  Key,
  Link,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Shield,
} from "lucide-react"
import { useConfig } from "@/lib/config-context"
import type { APIConfig, AuthType } from "@/lib/types"

export function ConfigScreen() {
  const { config, updateConfig, isConfigured } = useConfig()
  const [formData, setFormData] = useState<APIConfig>(config)
  const [isSaving, setIsSaving] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    setFormData(config)
  }, [config])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    
    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    updateConfig(formData)
    setSaveSuccess(true)
    setIsSaving(false)
    
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleReset = () => {
    setShowResetDialog(false)
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
    setFormData(defaultConfig)
  }

  const handleTestConnection = async () => {
    setTestResult(null)
    
    // Simular teste de conexão
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // Mock: 70% de chance de sucesso
    const success = Math.random() > 0.3
    setTestResult({
      success,
      message: success
        ? "Conexão estabelecida com sucesso!"
        : "Não foi possível conectar. Verifique as configurações.",
    })
    
    setTimeout(() => setTestResult(null), 5000)
  }

  const updateFormData = (path: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev }
      const keys = path.split(".")
      let current: Record<string, unknown> = newData

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] as Record<string, unknown>
      }
      current[keys[keys.length - 1]] = value

      return newData
    })
  }

  const authTypeLabels: Record<AuthType, string> = {
    bearer: "Bearer Token",
    apikey: "API Key",
    basic: "Basic Auth",
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Configurações
          </h2>
          <p className="text-sm text-muted-foreground">
            Configuração de integrações com ERP
          </p>
        </div>
        {isConfigured && (
          <div className="flex items-center gap-1 text-xs text-success">
            <CheckCircle2 className="h-4 w-4" />
            Configurado
          </div>
        )}
      </div>

      {/* Status de salvamento */}
      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3 text-sm text-success">
          <CheckCircle2 className="h-4 w-4" />
          Configurações salvas com sucesso!
        </div>
      )}

      {/* Resultado do teste */}
      {testResult && (
        <div
          className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
            testResult.success
              ? "bg-success/10 text-success"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {testResult.message}
        </div>
      )}

      <Accordion type="single" collapsible defaultValue="connection" className="space-y-3">
        {/* Configuração de Conexão */}
        <AccordionItem value="connection" className="border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <Server className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold">Conexão</p>
                <p className="text-xs text-muted-foreground font-normal">URL base da API</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="baseUrl">URL Base da API</FieldLabel>
                <Input
                  id="baseUrl"
                  type="url"
                  placeholder="https://api.erp.exemplo.com"
                  value={formData.baseUrl}
                  onChange={(e) => updateFormData("baseUrl", e.target.value)}
                  className="h-12"
                />
              </Field>
            </FieldGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Endpoints */}
        <AccordionItem value="endpoints" className="border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <Link className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold">Endpoints</p>
                <p className="text-xs text-muted-foreground font-normal">Rotas da API</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="consultaNFe">Consulta de NF-e (GET)</FieldLabel>
                <Input
                  id="consultaNFe"
                  placeholder="/api/v1/nfe"
                  value={formData.endpoints.consultaNFe}
                  onChange={(e) => updateFormData("endpoints.consultaNFe", e.target.value)}
                  className="h-12 font-mono text-sm"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="consultaOC">Consulta de OC (GET)</FieldLabel>
                <Input
                  id="consultaOC"
                  placeholder="/api/v1/ordens-compra"
                  value={formData.endpoints.consultaOC}
                  onChange={(e) => updateFormData("endpoints.consultaOC", e.target.value)}
                  className="h-12 font-mono text-sm"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="entradaNF">Entrada de NF (POST)</FieldLabel>
                <Input
                  id="entradaNF"
                  placeholder="/api/v1/nfe/entrada"
                  value={formData.endpoints.entradaNF}
                  onChange={(e) => updateFormData("endpoints.entradaNF", e.target.value)}
                  className="h-12 font-mono text-sm"
                />
              </Field>
            </FieldGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Autenticação */}
        <AccordionItem value="auth" className="border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold">Autenticação</p>
                <p className="text-xs text-muted-foreground font-normal">
                  {authTypeLabels[formData.auth.type]}
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="authType">Tipo de Autenticação</FieldLabel>
                <Select
                  value={formData.auth.type}
                  onValueChange={(value: AuthType) =>
                    setFormData((prev) => ({
                      ...prev,
                      auth: { ...prev.auth, type: value },
                    }))
                  }
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bearer">Bearer Token</SelectItem>
                    <SelectItem value="apikey">API Key</SelectItem>
                    <SelectItem value="basic">Basic Auth</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {formData.auth.type === "bearer" && (
                <Field>
                  <FieldLabel htmlFor="token">Token</FieldLabel>
                  <Input
                    id="token"
                    type="password"
                    placeholder="Seu token de acesso"
                    value={formData.auth.token || ""}
                    onChange={(e) => updateFormData("auth.token", e.target.value)}
                    className="h-12"
                  />
                </Field>
              )}

              {formData.auth.type === "apikey" && (
                <>
                  <Field>
                    <FieldLabel htmlFor="headerName">Nome do Header</FieldLabel>
                    <Input
                      id="headerName"
                      placeholder="X-API-Key"
                      value={formData.auth.headerName || ""}
                      onChange={(e) => updateFormData("auth.headerName", e.target.value)}
                      className="h-12"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="apiKey">API Key</FieldLabel>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Sua API Key"
                      value={formData.auth.apiKey || ""}
                      onChange={(e) => updateFormData("auth.apiKey", e.target.value)}
                      className="h-12"
                    />
                  </Field>
                </>
              )}

              {formData.auth.type === "basic" && (
                <>
                  <Field>
                    <FieldLabel htmlFor="username">Usuário</FieldLabel>
                    <Input
                      id="username"
                      placeholder="Usuário"
                      value={formData.auth.username || ""}
                      onChange={(e) => updateFormData("auth.username", e.target.value)}
                      className="h-12"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Senha"
                      value={formData.auth.password || ""}
                      onChange={(e) => updateFormData("auth.password", e.target.value)}
                      className="h-12"
                    />
                  </Field>
                </>
              )}
            </FieldGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Teste de conexão */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Testar Conexão</CardTitle>
          <CardDescription>
            Verifique se as configurações estão corretas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full h-12"
            onClick={handleTestConnection}
          >
            <Settings className="mr-2 h-4 w-4" />
            Testar Conexão com ERP
          </Button>
        </CardContent>
      </Card>

      {/* Botões de ação */}
      <div className="flex gap-3 mt-4">
        <Button
          variant="outline"
          className="flex-1 h-12"
          onClick={() => setShowResetDialog(true)}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Resetar
        </Button>
        <Button
          className="flex-1 h-12"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Spinner className="mr-2" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </>
          )}
        </Button>
      </div>

      {/* Informações sobre modo mock */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Modo de Demonstração</p>
              <p>
                O aplicativo está configurado para usar dados simulados.
                Em produção, conecte a um ERP real usando as configurações acima.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de reset */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resetar Configurações</AlertDialogTitle>
            <AlertDialogDescription>
              Isso irá restaurar todas as configurações para os valores padrão.
              Suas configurações atuais serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>
              Confirmar Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
