"use client"

import { useState, useCallback, useEffect, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { downloadImage } from "@/lib/image-processing"
import { Badge } from "@/components/ui/badge"
import { worstContrastForBackgrounds, wcagLevelForText } from "@/lib/utils"
import { Share2, Download, Palette, Type, Info } from "lucide-react"

interface OGImageGeneratorProps {
  disabled?: boolean
}

interface OGTemplate {
  id: string
  name: string
  description: string
  preview: string
}

const OG_TEMPLATES: OGTemplate[] = [
  { id: "minimal", name: "Minimal", description: "Clean text on solid background", preview: "Simple & clean" },
  { id: "gradient", name: "Gradient", description: "Text over gradient background", preview: "Modern gradient" },
  { id: "split", name: "Split Layout", description: "Title and subtitle in sections", preview: "Structured layout" },
  { id: "card", name: "Card Style", description: "Content in centered card", preview: "Card-based design" },
]

const BACKGROUND_PRESETS = [
  { name: "White", value: "#ffffff", textColor: "#1f2937" },
  { name: "Dark", value: "#1f2937", textColor: "#ffffff" },
  { name: "Blue", value: "#3b82f6", textColor: "#ffffff" },
  { name: "Green", value: "#10b981", textColor: "#ffffff" },
  { name: "Purple", value: "#8b5cf6", textColor: "#ffffff" },
  { name: "Orange", value: "#f59e0b", textColor: "#ffffff" },
  { name: "Red", value: "#ef4444", textColor: "#ffffff" },
  { name: "Teal", value: "#14b8a6", textColor: "#ffffff" },
]

const GRADIENT_PRESETS = [
  { name: "Blue to Purple", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Orange to Pink", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Green to Blue", value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Purple to Pink", value: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
  { name: "Dark to Light", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
]

export function OGImageGenerator({ disabled = false }: OGImageGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("minimal")
  const [title, setTitle] = useState("Your Amazing Title")
  const [subtitle, setSubtitle] = useState("Compelling subtitle that describes your content")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [textColor, setTextColor] = useState("#1f2937")
  const [useGradient, setUseGradient] = useState(false)
  const [gradientValue, setGradientValue] = useState(GRADIENT_PRESETS[0].value)
  // interactive gradient controls
  const [gradientStart, setGradientStart] = useState<string>("#667eea")
  const [gradientEnd, setGradientEnd] = useState<string>("#764ba2")
  const [gradientAngle, setGradientAngle] = useState<number>(135)
  const [fontSize, setFontSize] = useState(72)
  const [subtitleSize, setSubtitleSize] = useState(36)
  const [generatedImage, setGeneratedImage] = useState<{ blob: Blob; dataUrl: string } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Contrast helper: compute worst-case contrast for current background(s)
  const getContrastInfo = useCallback(
    (px: number, isBold = false) => {
      const isLarge = px >= 24 || (isBold && px >= 19)
      const backgrounds = useGradient ? [gradientStart, gradientEnd] : [backgroundColor]
      const ratio = worstContrastForBackgrounds(textColor, backgrounds)
      const { level } = wcagLevelForText(ratio, isLarge)
      const badgeClass =
        level === "Fail"
          ? "bg-red-50 text-red-700 border-red-200"
          : level === "AA Large"
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-emerald-50 text-emerald-700 border-emerald-200"
      const friendly =
        level === "Fail"
          ? "Readability: Poor"
          : level === "AA Large"
          ? "Readability: Good (for large text)"
          : "Readability: Excellent"
      const suggest = isLarge ? "Recommended ≥ 3.0:1 (large text)" : "Recommended ≥ 4.5:1 (body text)"
      const tooltip = `Contrast ${ratio.toFixed(1)}:1 • Standard ${level} • ${suggest}`
      const label = `${ratio.toFixed(1)}:1 • ${level}`
      return { ratio, level, badgeClass, label, friendly, tooltip }
    },
    [useGradient, gradientStart, gradientEnd, backgroundColor, textColor]
  )

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

  // Auto toggle gradient mode when template changes
  useEffect(() => {
    if (selectedTemplate === "gradient") {
      setUseGradient(true)
    } else {
      setUseGradient(false)
    }
  }, [selectedTemplate])

  // keep gradientValue in sync with interactive picks for preview string (optional)
  useEffect(() => {
    if (useGradient) {
      setGradientValue(`linear-gradient(${gradientAngle}deg, ${gradientStart} 0%, ${gradientEnd} 100%)`)
    }
  }, [useGradient, gradientStart, gradientEnd, gradientAngle])

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
  }, [generateAdvancedOGImage])

  const handleDownload = useCallback(() => {
    if (!generatedImage) return
    downloadImage(generatedImage.blob, `og-image-${Date.now()}.png`)
  }, [generatedImage])

  const handlePresetSelect = useCallback((preset: (typeof BACKGROUND_PRESETS)[0]) => {
    setBackgroundColor(preset.value)
    setTextColor(preset.textColor)
    setUseGradient(false)
  }, [])

  // Auto-generate on changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title && subtitle) {
        handleGenerate()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [title, subtitle, backgroundColor, textColor, selectedTemplate, fontSize, subtitleSize, useGradient, gradientValue, gradientStart, gradientEnd, gradientAngle, handleGenerate])

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Share2 className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold font-serif">OG Image Generator</h2>
      </div>

      {/* Template Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Template</Label>
        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {OG_TEMPLATES.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{template.name}</span>
                  <span className="text-xs text-muted-foreground">{template.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your title"
            disabled={disabled || isGenerating}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Subtitle</Label>
          <Textarea
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Enter your subtitle"
            rows={2}
            disabled={disabled || isGenerating}
          />
        </div>
      </div>

      {/* Typography Controls */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Typography</Label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Title Size: {fontSize}px</Label>
            <Slider
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
              min={40}
              max={120}
              step={4}
              disabled={disabled || isGenerating}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Subtitle Size: {subtitleSize}px</Label>
            <Slider
              value={[subtitleSize]}
              onValueChange={(value) => setSubtitleSize(value[0])}
              min={20}
              max={60}
              step={2}
              disabled={disabled || isGenerating}
            />
          </div>
        </div>

        {useGradient && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Gradient</Label>
            </div>

            {/* Gradient color pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Start</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={gradientStart}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setGradientStart(e.target.value); setUseGradient(true) }}
                    className="w-12 h-8 p-1 border rounded"
                    disabled={disabled || isGenerating}
                  />
                  <Input
                    value={gradientStart}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setGradientStart(e.target.value); setUseGradient(true) }}
                    className="flex-1 text-xs"
                    disabled={disabled || isGenerating}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">End</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={gradientEnd}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setGradientEnd(e.target.value); setUseGradient(true) }}
                    className="w-12 h-8 p-1 border rounded"
                    disabled={disabled || isGenerating}
                  />
                  <Input
                    value={gradientEnd}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setGradientEnd(e.target.value); setUseGradient(true) }}
                    className="flex-1 text-xs"
                    disabled={disabled || isGenerating}
                  />
                </div>
              </div>
            </div>

            {/* Gradient angle */}
            <div className="space-y-2">
              <Label className="text-xs">Angle: {gradientAngle}°</Label>
              <Slider
                value={[gradientAngle]}
                onValueChange={(v: number[]) => { setGradientAngle(v[0]); setUseGradient(true) }}
                min={0}
                max={360}
                step={1}
                disabled={disabled || isGenerating}
              />
            </div>

            {/* Quick presets */}
            <div className="grid grid-cols-3 gap-2">
              {GRADIENT_PRESETS.map((p) => (
                <Button
                  key={p.name}
                  variant="outline"
                  size="sm"
                  className="h-8 text-[11px] bg-transparent"
                  onClick={() => {
                    setUseGradient(true)
                    setGradientValue(p.value)
                    // try to parse two colors for start/end for consistency
                    const m = p.value.match(/(#[0-9a-fA-F]{3,8}|rgba?\([^\)]+\))/g) || []
                    if (m[0]) setGradientStart(m[0])
                    if (m[1]) setGradientEnd(m[1])
                  }}
                  style={{ background: p.value, color: "#fff" }}
                >
                  {p.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Color Controls */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Colors</Label>
        </div>

        {/* Solid color tools are hidden when gradient mode is on */}
        {!useGradient && (
          <>
            {/* Color Presets (Solid) */}
            <div className="grid grid-cols-4 gap-2">
              {BACKGROUND_PRESETS.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetSelect(preset)}
                  className="h-8 text-xs bg-transparent"
                  style={{ backgroundColor: preset.value, color: preset.textColor }}
                >
                  {preset.name}
                </Button>
              ))}
            </div>

            {/* Background (Solid) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Background</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={backgroundColor}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setBackgroundColor(e.target.value)}
                    className="w-12 h-8 p-1 border rounded"
                    disabled={disabled || isGenerating}
                  />
                  <Input
                    value={backgroundColor}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setBackgroundColor(e.target.value)}
                    className="flex-1 text-xs"
                    disabled={disabled || isGenerating}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Text Color is always available */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Text Color</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={textColor}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTextColor(e.target.value)}
                className="w-12 h-8 p-1 border rounded"
                disabled={disabled || isGenerating}
              />
              <Input
                value={textColor}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTextColor(e.target.value)}
                className="flex-1 text-xs"
                disabled={disabled || isGenerating}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      {generatedImage && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Preview (1200×630)</Label>
            <Button variant="outline" size="sm" onClick={handleDownload} className="bg-transparent">
              <Download className="w-3 h-3 mr-1" />
              Download
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden bg-muted">
            <img
              src={generatedImage.dataUrl || "/placeholder.svg"}
              alt="Generated OG Image"
              className="w-full h-auto"
              style={{ aspectRatio: "1200/630" }}
            />
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Size: {(generatedImage.blob.size / 1024).toFixed(1)} KB • 1200×630 pixels
          </div>

          {/* Contrast badges */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {(() => {
              const t = getContrastInfo(fontSize, true)
              const s = getContrastInfo(subtitleSize, false)
              return (
                <>
                  <Badge
                    variant="outline"
                    className={`px-2 py-0.5 text-[11px] ${t.badgeClass}`}
                    title={t.tooltip}
                  >
                    Title readability: {t.friendly.replace('Readability: ', '')}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`px-2 py-0.5 text-[11px] ${s.badgeClass}`}
                    title={s.tooltip}
                  >
                    Subtitle readability: {s.friendly.replace('Readability: ', '')}
                  </Badge>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <Button onClick={handleGenerate} disabled={disabled || isGenerating} className="w-full" size="lg">
        <Share2 className="w-4 h-4 mr-2" />
        {isGenerating ? "Generating..." : "Generate OG Image"}
      </Button>

      {/* Usage Tips */}
      <Alert>
        <Info className="h-4 w-4 text-muted-foreground" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium text-foreground">OG Image Best Practices</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Use high contrast between text and background</li>
              <li>• Keep text large and readable (minimum 40px)</li>
              <li>• Optimal size is 1200×630 pixels (1.91:1 ratio)</li>
              <li>• Test how it looks when shared on social platforms</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* HTML Meta Tags */}
      {generatedImage && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">HTML Meta Tags</Label>
          <div className="p-3 rounded-lg border bg-muted/60">
            <code className="text-xs text-muted-foreground">
              {`<meta property="og:image" content="/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${subtitle}" />`}
            </code>
          </div>
        </div>
      )}
    </Card>
  )
}
