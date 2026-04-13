"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle } from "lucide-react"
import Image from "next/image"

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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#d9e2e7" }}>
      <Card className="w-full max-w-md border-white/30" style={{ backgroundColor: "#00508b" }}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <Image
              src="/conenge logo.svg"
              alt="Conenge"
              width={300}
              height={100}
              priority
            />
          </div>
          <CardDescription className="text-white/70">
            Sistema de Recebimento de Materiais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} action="#" method="post">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="text-white">E-mail</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-base bg-white/10 border-white/40 text-white placeholder:text-white/40 focus:border-white"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password" className="text-white">Senha</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 text-base bg-white/10 border-white/40 text-white placeholder:text-white/40 focus:border-white"
                />
              </Field>
            </FieldGroup>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/10 border border-white/20 p-3 text-sm text-white">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="button"
              onClick={doLogin}
              className="mt-6 h-14 w-full text-lg font-semibold text-white hover:opacity-90 border-0"
              style={{ backgroundColor: "#102633" }}
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

          <div className="mt-6 rounded-lg bg-white/10 border border-white/20 p-4 text-sm text-white/70">
            <p className="font-medium mb-2 text-white">Credenciais de teste:</p>
            <p>Admin: admin@empresa.com</p>
            <p>Operador: operador@empresa.com</p>
            <p>Senha: 123456</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
