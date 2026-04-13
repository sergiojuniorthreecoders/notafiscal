import { NextRequest, NextResponse } from "next/server"
import { getNFes, getNFeByChave, getNFeById, updateNFe } from "@/lib/data-store"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const chave = searchParams.get("chave")
  const id = searchParams.get("id")

  if (chave) {
    const nfe = getNFeByChave(chave)
    return NextResponse.json(nfe)
  }

  if (id) {
    const nfe = getNFeById(id)
    return NextResponse.json(nfe)
  }

  return NextResponse.json(getNFes())
}

export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 })

  const body = await request.json()
  const updated = updateNFe(id, body)
  if (!updated) return NextResponse.json({ error: "NF-e não encontrada" }, { status: 404 })

  return NextResponse.json(updated)
}
