"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { FileText, AlertCircle } from "lucide-react"

export function LoginScreen() {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const doLogin = async () => {
    setError("")
    const success = await login(email, password)
    if (!success) setError("E-mail ou senha inválidos")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    doLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <FileText className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">NF-e Scanner</CardTitle>
          <CardDescription>
            Sistema de Recebimento de Mercadorias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} action="#" method="post">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-base"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 text-base"
                />
              </Field>
            </FieldGroup>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="button"
              onClick={doLogin}
              className="mt-6 h-14 w-full text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="mt-6 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            <p className="font-medium mb-2">Credenciais de teste:</p>
            <p>Admin: admin@empresa.com</p>
            <p>Operador: operador@empresa.com</p>
            <p>Senha: 123456</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
