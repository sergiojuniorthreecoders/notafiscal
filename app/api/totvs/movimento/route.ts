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

function stripEmpty(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripEmpty)
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === null || v === undefined || v === "" || v === 0) continue
      out[k] = stripEmpty(v)
    }
    return out
  }
  return value
}

async function totvsPost(path: string, body: unknown) {
  const token = await autenticar()
  return fetch(`${TOTVS_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(stripEmpty(body)),
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

export async function PUT(request: NextRequest) {
  const { internalId, payload } = await request.json()
  if (!internalId) {
    return NextResponse.json({ error: "internalId obrigatório" }, { status: 400 })
  }
  const token = await autenticar()
  const res = await fetch(`${TOTVS_BASE}/api/mov/v1/Movements/${internalId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(stripEmpty(payload)),
  })
  const json = await res.json()
  return NextResponse.json(json, { status: res.status })
}
