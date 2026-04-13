import { NextRequest, NextResponse } from "next/server"
import { getOCs, getOCByNumero, getOCById, updateOC } from "@/lib/data-store"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const numero = searchParams.get("numero")
  const id = searchParams.get("id")

  if (numero) {
    const oc = getOCByNumero(numero)
    return NextResponse.json(oc)
  }

  if (id) {
    const oc = getOCById(id)
    return NextResponse.json(oc)
  }

  return NextResponse.json(getOCs())
}

export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 })

  const body = await request.json()
  const updated = updateOC(id, body)
  if (!updated) return NextResponse.json({ error: "OC não encontrada" }, { status: 404 })

  return NextResponse.json(updated)
}
