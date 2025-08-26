import { useState, useCallback } from "react"

export interface OGImageState {
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
  generatedImage: { blob: Blob; dataUrl: string } | null
  isGenerating: boolean
}

export const GRADIENT_PRESETS = [
  { name: "Blue to Purple", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Orange to Pink", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Green to Blue", value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Purple to Pink", value: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
  { name: "Dark to Light", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
]

export const BACKGROUND_PRESETS = [
  { name: "White", value: "#ffffff", textColor: "#1f2937" },
  { name: "Dark", value: "#1f2937", textColor: "#ffffff" },
  { name: "Blue", value: "#3b82f6", textColor: "#ffffff" },
  { name: "Green", value: "#10b981", textColor: "#ffffff" },
  { name: "Purple", value: "#8b5cf6", textColor: "#ffffff" },
  { name: "Orange", value: "#f59e0b", textColor: "#ffffff" },
  { name: "Red", value: "#ef4444", textColor: "#ffffff" },
  { name: "Teal", value: "#14b8a6", textColor: "#ffffff" },
]

export function useOGImageState() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("minimal")
  const [title, setTitle] = useState("Your Amazing Title")
  const [subtitle, setSubtitle] = useState("Compelling subtitle that describes your content")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [textColor, setTextColor] = useState("#1f2937")
  const [useGradient, setUseGradient] = useState(false)
  const [gradientValue, setGradientValue] = useState(GRADIENT_PRESETS[0].value)
  const [gradientStart, setGradientStart] = useState<string>("#667eea")
  const [gradientEnd, setGradientEnd] = useState<string>("#764ba2")
  const [gradientAngle, setGradientAngle] = useState<number>(135)
  const [fontSize, setFontSize] = useState(72)
  const [subtitleSize, setSubtitleSize] = useState(36)
  const [generatedImage, setGeneratedImage] = useState<{ blob: Blob; dataUrl: string } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handlePresetSelect = useCallback((preset: (typeof BACKGROUND_PRESETS)[0]) => {
    setBackgroundColor(preset.value)
    setTextColor(preset.textColor)
    setUseGradient(false)
  }, [])

  const handleGradientPresetSelect = useCallback((preset: (typeof GRADIENT_PRESETS)[0]) => {
    setUseGradient(true)
    setGradientValue(preset.value)
    // try to parse two colors for start/end for consistency
    const m = preset.value.match(/(#[0-9a-fA-F]{3,8}|rgba?\([^\)]+\))/g) || []
    if (m[0]) setGradientStart(m[0])
    if (m[1]) setGradientEnd(m[1])
  }, [])

  return {
    // State values
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
    generatedImage,
    isGenerating,
    
    // Setters
    setSelectedTemplate,
    setTitle,
    setSubtitle,
    setBackgroundColor,
    setTextColor,
    setUseGradient,
    setGradientValue,
    setGradientStart,
    setGradientEnd,
    setGradientAngle,
    setFontSize,
    setSubtitleSize,
    setGeneratedImage,
    setIsGenerating,
    
    // Handlers
    handlePresetSelect,
    handleGradientPresetSelect,
  }
}
