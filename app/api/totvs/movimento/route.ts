import { NextRequest, NextResponse } from "next/server"
import { autenticar, construirPayloadEntrada } from "@/lib/totvs-api"
import type { AvaliacaoEntrada, TotvsMovimento } from "@/lib/totvs-api"

const TOTVS_BASE = "https://conengesc167547.rm.cloudtotvs.com.br:8051"

// Fetch nativo — não codifica | no path, ao contrário do axios
async function totvsGet(path: string) {
  const token = await autenticar()
  const url = `${TOTVS_BASE}${path}`
  console.log("[TOTVS GET]", url)
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

async function totvsPost(path: string, body: unknown) {
  const token = await autenticar()
  return fetch(`${TOTVS_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  })
}

export async function GET(request: NextRequest) {
  const internalId = new URL(request.url).searchParams.get("internalId")
  if (!internalId) {
    return NextResponse.json({ error: "internalId obrigatório" }, { status: 400 })
  }

  const res = await totvsGet(`/api/mov/v1/Movements/${internalId}`)
  const json = await res.json()
  return NextResponse.json(json, { status: res.status })
}

export async function POST(request: NextRequest) {
  const payload = await request.json()
  const res = await totvsPost("/api/mov/v1/movements", payload)
  const json = await res.json()
  return NextResponse.json(json, { status: res.status })
}
