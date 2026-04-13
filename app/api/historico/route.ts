import { NextRequest, NextResponse } from "next/server"
import { getHistorico, addHistoricoEntry } from "@/lib/data-store"

export async function GET() {
  const hist = getHistorico()
  return NextResponse.json(hist)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const entry = addHistoricoEntry(body)
  return NextResponse.json(entry, { status: 201 })
}
