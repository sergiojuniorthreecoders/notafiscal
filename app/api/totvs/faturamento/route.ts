import { NextRequest, NextResponse } from "next/server"

const TOTVS_BASE = "https://conengesc167547.rm.cloudtotvs.com.br:8051"
const SOAP_USUARIO = "hyperdata"
const SOAP_SENHA   = "|mB{6=GtFE4:Bw-JwCpb"

function buildXml(codColigada: string, idMovOrigem: string) {
  return `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tot="http://www.totvs.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <tot:MovFaturamentoProc>
         <tot:MovFaturamentoProcParams>
            <tot:movCopiaFatPar>
               <tot:CodColigada>${codColigada}</tot:CodColigada>
               <tot:CodSistema>T</tot:CodSistema>
               <tot:CodUsuario>${SOAP_USUARIO}</tot:CodUsuario>
               <tot:CodTmvOrigem>1.1.06</tot:CodTmvOrigem>
               <tot:IdMovOrigem>${idMovOrigem}</tot:IdMovOrigem>
               <tot:CodTmvDestino>1.1.20</tot:CodTmvDestino>
            </tot:movCopiaFatPar>
         </tot:MovFaturamentoProcParams>
      </tot:MovFaturamentoProc>
   </soapenv:Body>
</soapenv:Envelope>`
}

function extractTag(xml: string, name: string): string {
  const m = xml.match(new RegExp(`<(?:[^:>]*:)?${name}[^>]*>([\\s\\S]*?)<\\/(?:[^:>]*:)?${name}>`))
  return m ? m[1].trim() : ""
}

function extractFault(xml: string): string {
  return (
    extractTag(xml, "faultstring") ||
    extractTag(xml, "Text") ||
    extractTag(xml, "message") ||
    "Erro SOAP desconhecido"
  )
}

export async function POST(request: NextRequest) {
  const { codColigada, idMovOrigem } = await request.json()

  if (!codColigada || !idMovOrigem) {
    return NextResponse.json(
      { success: false, error: "codColigada e idMovOrigem são obrigatórios" },
      { status: 400 }
    )
  }

  const xml      = buildXml(String(codColigada), String(idMovOrigem))
  const basicAuth = Buffer.from(`${SOAP_USUARIO}:${SOAP_SENHA}`).toString("base64")

  let text = ""
  try {
    console.log("[SOAP] Chamando MovFaturamentoProc — coligada:", codColigada, "idMov:", idMovOrigem)
    const res = await fetch(`${TOTVS_BASE}/wsMovFaturamentoProc.apw`, {
      method: "POST",
      headers: {
        "Content-Type":  "text/xml",
        "SOAPAction":    '"MovFaturamentoProc"',
        "Authorization": `Basic ${basicAuth}`,
      },
      body: xml,
    })
    text = await res.text()
    console.log("[SOAP] Resposta HTTP", res.status, text.slice(0, 500))

    if (res.status === 401) {
      return NextResponse.json({ success: false, error: "Credenciais inválidas (401)" }, { status: 401 })
    }
    if (res.status === 403) {
      return NextResponse.json({ success: false, error: "Sem permissão para executar esta operação (403)" }, { status: 403 })
    }
  } catch (err) {
    console.error("[SOAP] Erro de rede:", err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }

  // SOAP Fault (pode vir com HTTP 200 ou 500)
  if (text.includes(":Fault") || text.includes("<faultstring")) {
    const fault = extractFault(text)
    return NextResponse.json({ success: false, error: fault }, { status: 400 })
  }

  const idMovGerado = extractTag(text, "IdMovGerado")
  if (!idMovGerado) {
    console.error("[SOAP] IdMovGerado não encontrado. Resposta completa:", text)
    return NextResponse.json(
      { success: false, error: "IdMovGerado não encontrado na resposta SOAP", rawResponse: text },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, idMovGerado: parseInt(idMovGerado, 10) })
}
