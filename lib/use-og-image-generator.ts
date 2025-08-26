import { useCallback, useEffect } from "react"
import { downloadImage } from "@/lib/image-processing"
import type { OGImageState } from "./use-og-image-state"

export interface OGTemplate {
  id: string
  name: string
  description: string
  preview: string
}

export const OG_TEMPLATES: OGTemplate[] = [
  { id: "minimal", name: "Minimal", description: "Clean text on solid background", preview: "Simple & clean" },
  { id: "gradient", name: "Gradient", description: "Text over gradient background", preview: "Modern gradient" },
  { id: "split", name: "Split Layout", description: "Title and subtitle in sections", preview: "Structured layout" },
  { id: "card", name: "Card Style", description: "Content in centered card", preview: "Card-based design" },
]

interface UseOGImageGeneratorProps {
  selectedTemplate: string
  title: string
  subtitle: string
  backgroundColor: string
  textColor: string
  useGradient: boolean
  gradientValue: string
  gradientStart: string
  gradientEnd: string
  gradientAngle: number
  fontSize: number
  subtitleSize: number
  setGeneratedImage: (image: { blob: Blob; dataUrl: string } | null) => void
  setIsGenerating: (generating: boolean) => void
  setUseGradient: (useGradient: boolean) => void
  setGradientValue: (value: string) => void
}

export function useOGImageGenerator({
  selectedTemplate,
  title,
  subtitle,
  backgroundColor,
  textColor,
  useGradient,
  gradientValue,
  gradientStart,
  gradientEnd,
  gradientAngle,
  fontSize,
  subtitleSize,
  setGeneratedImage,
  setIsGenerating,
  setUseGradient,
  setGradientValue,
}: UseOGImageGeneratorProps) {

  const generateAdvancedOGImage = useCallback(async () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!
    canvas.width = 1200
    canvas.height = 630

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply background (solid or gradient)
    if (useGradient && gradientValue) {
      // compute direction from angle (CSS: 0deg is pointing up, 90deg right)
      const angleRad = (gradientAngle - 90) * (Math.PI / 180) // adjust so 0deg is to the right for canvas vector math
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const vx = Math.cos(angleRad)
      const vy = Math.sin(angleRad)
      const half = Math.hypot(canvas.width, canvas.height) / 2
      const x0 = cx - vx * half
      const y0 = cy - vy * half
      const x1 = cx + vx * half
      const y1 = cy + vy * half

      const lg = ctx.createLinearGradient(x0, y0, x1, y1)
      // extract hex/rgb/rgba from CSS gradient string
      const colorRegex = /(#[0-9a-fA-F]{3,8}|rgba?\([^\)]+\))/g
      let colors = gradientValue.match(colorRegex) || []
      // if user chose custom colors, override parsed colors
      if (gradientStart && gradientEnd) {
        colors = [gradientStart, gradientEnd]
      }

      if (colors.length >= 2) {
        // distribute color stops evenly when explicit stops are not parsed
        colors.forEach((c: string, i: number) => {
          const t = colors.length === 1 ? 0 : i / (colors.length - 1)
          lg.addColorStop(Math.max(0, Math.min(1, t)), c)
        })
        ctx.fillStyle = lg
      } else {
        // fallback to solid if parsing failed
        ctx.fillStyle = backgroundColor
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    } else {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Set text properties
    ctx.fillStyle = textColor
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Apply template-specific layout
    switch (selectedTemplate) {
      case "minimal":
        // Simple centered text
        ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`
        ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 40)
        ctx.font = `${subtitleSize}px system-ui, -apple-system, sans-serif`
        ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 40)
        break

      case "gradient":
        // Text with shadow for better readability
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
        ctx.shadowBlur = 10
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2
        ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`
        ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 40)
        ctx.font = `${subtitleSize}px system-ui, -apple-system, sans-serif`
        ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 40)
        break

      case "split":
        // Title in upper section, subtitle in lower
        ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`
        ctx.fillText(title, canvas.width / 2, canvas.height / 3)
        ctx.font = `${subtitleSize}px system-ui, -apple-system, sans-serif`
        ctx.fillText(subtitle, canvas.width / 2, (canvas.height * 2) / 3)
        break

      case "card":
        // Draw card background
        const cardPadding = 80
        const cardX = cardPadding
        const cardY = cardPadding
        const cardWidth = canvas.width - cardPadding * 2
        const cardHeight = canvas.height - cardPadding * 2

        ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
        ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 20)
        ctx.fill()

        // Text inside card
        ctx.fillStyle = textColor
        ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`
        ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 40)
        ctx.font = `${subtitleSize}px system-ui, -apple-system, sans-serif`
        ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 40)
        break
    }

    // Convert to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), "image/png")
    })

    const dataUrl = canvas.toDataURL("image/png")

    return { blob, dataUrl }
  }, [selectedTemplate, title, subtitle, backgroundColor, textColor, useGradient, fontSize, subtitleSize, gradientValue, gradientStart, gradientEnd, gradientAngle])

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    try {
      const result = await generateAdvancedOGImage()
      setGeneratedImage(result)
    } catch (error) {
      console.error("Error generating OG image:", error)
    } finally {
      setIsGenerating(false)
    }
  }, [generateAdvancedOGImage, setGeneratedImage, setIsGenerating])

  const handleDownload = useCallback((generatedImage: { blob: Blob; dataUrl: string } | null) => {
    if (!generatedImage) return
    downloadImage(generatedImage.blob, `og-image-${Date.now()}.png`)
  }, [])

  // Auto toggle gradient mode when template changes
  useEffect(() => {
    if (selectedTemplate === "gradient") {
      setUseGradient(true)
    } else {
      setUseGradient(false)
    }
  }, [selectedTemplate, setUseGradient])

  // keep gradientValue in sync with interactive picks for preview string (optional)
  useEffect(() => {
    if (useGradient) {
      setGradientValue(`linear-gradient(${gradientAngle}deg, ${gradientStart} 0%, ${gradientEnd} 100%)`)
    }
  }, [useGradient, gradientStart, gradientEnd, gradientAngle, setGradientValue])

  // Auto-generate on changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title && subtitle) {
        handleGenerate()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [title, subtitle, backgroundColor, textColor, selectedTemplate, fontSize, subtitleSize, useGradient, gradientValue, gradientStart, gradientEnd, gradientAngle, handleGenerate])

  return {
    handleGenerate,
    handleDownload,
  }
}
