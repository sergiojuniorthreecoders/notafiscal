"use client"

import { useEffect, useRef } from "react"

interface BarcodeReaderProps {
  onDetected: (code: string) => void
  onError?: (msg: string) => void
  active: boolean
}

declare class BarcodeDetector {
  constructor(options?: { formats: string[] })
  detect(source: HTMLVideoElement | HTMLCanvasElement): Promise<Array<{ rawValue: string }>>
  static getSupportedFormats(): Promise<string[]>
}

export function BarcodeReader({ onDetected, onError, active }: BarcodeReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const onDetectedRef = useRef(onDetected)
  const onErrorRef = useRef(onError)
  useEffect(() => { onDetectedRef.current = onDetected }, [onDetected])
  useEffect(() => { onErrorRef.current = onError }, [onError])

  useEffect(() => {
    if (!active || !containerRef.current) return

    let cancelled = false
    let stream: MediaStream | null = null
    let intervalId: ReturnType<typeof setInterval> | null = null
    let zxingControls: { stop: () => void } | null = null
    let detecting = false
    const container = containerRef.current

    // Debounce contra double-mount do React StrictMode
    const timer = setTimeout(async () => {
      if (cancelled || !container) return

      const hasBarcodeDetector = "BarcodeDetector" in window

      if (hasBarcodeDetector) {
        // ── Caminho 1: BarcodeDetector nativo (Chrome/Edge/Android) ────────────
        if (!navigator.mediaDevices?.getUserMedia) {
          onErrorRef.current?.("Câmera bloqueada: o scanner requer HTTPS. Use a aba Manual para digitar a chave.")
          return
        }

        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "environment",
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          })
          if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return }

          const video = document.createElement("video")
          video.srcObject = stream
          video.playsInline = true
          video.muted = true
          video.setAttribute("autoplay", "true")
          container.appendChild(video)

          // Aguarda metadados (dimensões) antes de reproduzir
          await new Promise<void>((resolve) => {
            if (video.readyState >= 1) { resolve(); return }
            video.onloadedmetadata = () => resolve()
            setTimeout(() => resolve(), 3000) // fallback timeout
          })
          if (cancelled) return

          await video.play()
          if (cancelled) return

          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")!

          const detector = new BarcodeDetector({
            formats: ["code_128", "ean_13", "ean_8", "itf", "code_39", "qr_code", "pdf417", "data_matrix"],
          })

          // Scan a 5fps — evita chamadas concorrentes que travam o detector
          intervalId = setInterval(async () => {
            if (cancelled || detecting) return
            if (video.readyState < 4) return // HAVE_ENOUGH_DATA
            if (video.videoWidth === 0 || video.videoHeight === 0) return

            detecting = true
            try {
              canvas.width = video.videoWidth
              canvas.height = video.videoHeight
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
              const results = await detector.detect(canvas)
              if (results.length > 0 && results[0].rawValue) {
                onDetectedRef.current(results[0].rawValue)
              }
            } catch {
              // frame inválido — tentar no próximo ciclo
            } finally {
              detecting = false
            }
          }, 200)

        } catch (e) {
          console.error("Erro ao acessar câmera:", e)
          if (!cancelled) {
            onErrorRef.current?.("Não foi possível acessar a câmera. Use a aba Manual.")
          }
        }

      } else {
        // ── Caminho 2: ZXing como fallback (Firefox, Safari) ──────────────────
        if (!navigator.mediaDevices?.getUserMedia) {
          onErrorRef.current?.("Câmera bloqueada: o scanner requer HTTPS. Use a aba Manual para digitar a chave.")
          return
        }

        try {
          const { BrowserMultiFormatReader } = await import("@zxing/browser")
          if (cancelled) return

          const reader = new BrowserMultiFormatReader()
          const video = document.createElement("video")
          container.appendChild(video)

          const controls = await reader.decodeFromVideoDevice(
            undefined,
            video,
            (result, err) => {
              if (cancelled) return
              if (result) onDetectedRef.current(result.getText())
              if (err && (err as Error).name !== "NotFoundException") {
                console.warn("ZXing error:", err)
              }
            }
          )
          zxingControls = controls
        } catch (e) {
          console.error("ZXing fallback error:", e)
          if (!cancelled) {
            onErrorRef.current?.("Não foi possível iniciar o scanner. Use a aba Manual.")
          }
        }
      }
    }, 150)

    return () => {
      cancelled = true
      clearTimeout(timer)
      if (intervalId !== null) clearInterval(intervalId)
      if (stream) stream.getTracks().forEach((t) => t.stop())
      if (zxingControls) { try { zxingControls.stop() } catch {} }
      const video = container.querySelector("video")
      if (video) { try { container.removeChild(video) } catch {} }
    }
  }, [active])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 bg-black [&_video]:w-full [&_video]:h-full [&_video]:object-cover"
    />
  )
}
