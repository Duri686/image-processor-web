"use client"

import { Share2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

import { useOGImageState } from "@/lib/use-og-image-state"
import { useOGImageGenerator } from "@/lib/use-og-image-generator"
import { useContrastAnalysis } from "@/lib/use-contrast-analysis"

import { OGTemplateSelector } from "@/components/og-image/og-template-selector"
import { OGContentEditor } from "@/components/og-image/og-content-editor"
import { OGTypographyControls } from "@/components/og-image/og-typography-controls"
import { OGColorControls } from "@/components/og-image/og-color-controls"
import { OGPreview } from "@/components/og-image/og-preview"
import { OGMetaTags } from "@/components/og-image/og-meta-tags"

interface OGImageGeneratorProps {
  disabled?: boolean
}

export function OGImageGenerator({ disabled = false }: OGImageGeneratorProps) {
  const {
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
  } = useOGImageState()

  const { handleGenerate, handleDownload } = useOGImageGenerator({
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
  })

  const { getContrastInfo } = useContrastAnalysis(
    textColor,
    backgroundColor,
    useGradient,
    gradientStart,
    gradientEnd
  )

  const titleContrastInfo = getContrastInfo(fontSize, true)
  const subtitleContrastInfo = getContrastInfo(subtitleSize, false)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <div className="flex items-center gap-3">
          <Share2 className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">OG Image Generator</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Create stunning social media preview images</p>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <OGTemplateSelector
        selectedTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
        disabled={disabled || isGenerating}
      />

      {/* Content Editor */}
      <OGContentEditor
        title={title}
        subtitle={subtitle}
        onTitleChange={setTitle}
        onSubtitleChange={setSubtitle}
        disabled={disabled || isGenerating}
      />

      {/* Typography Controls */}
      <OGTypographyControls
        fontSize={fontSize}
        subtitleSize={subtitleSize}
        useGradient={useGradient}
        gradientStart={gradientStart}
        gradientEnd={gradientEnd}
        gradientAngle={gradientAngle}
        onFontSizeChange={setFontSize}
        onSubtitleSizeChange={setSubtitleSize}
        onGradientStartChange={(color) => {
          setGradientStart(color)
          setUseGradient(true)
        }}
        onGradientEndChange={(color) => {
          setGradientEnd(color)
          setUseGradient(true)
        }}
        onGradientAngleChange={(angle) => {
          setGradientAngle(angle)
          setUseGradient(true)
        }}
        onGradientPresetSelect={handleGradientPresetSelect}
        disabled={disabled || isGenerating}
      />

      {/* Color Controls */}
      <OGColorControls
        backgroundColor={backgroundColor}
        textColor={textColor}
        useGradient={useGradient}
        onBackgroundColorChange={setBackgroundColor}
        onTextColorChange={setTextColor}
        onUseGradientChange={setUseGradient}
        onPresetSelect={handlePresetSelect}
        disabled={disabled || isGenerating}
      />

      {/* Generate Button */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <Button
          onClick={handleGenerate}
          disabled={disabled || isGenerating || !title.trim()}
          className="w-full h-12 text-base font-medium rounded-lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 mr-2" />
              Generate OG Image
            </>
          )}
        </Button>
      </div>

      {/* Preview */}
      <OGPreview
        generatedImage={generatedImage}
        titleContrastInfo={titleContrastInfo}
        subtitleContrastInfo={subtitleContrastInfo}
        onDownload={() => handleDownload(generatedImage)}
      />

      {/* Usage Tips */}
      <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-800 dark:text-blue-300">
          <p className="font-medium mb-2">OG Image Best Practices:</p>
          <ul className="space-y-1 text-sm">
            <li>• Use high contrast between text and background</li>
            <li>• Keep text large and readable (minimum 40px)</li>
            <li>• Optimal size is 1200×630 pixels (1.91:1 ratio)</li>
            <li>• Test how it looks when shared on social platforms</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* HTML Meta Tags */}
      {generatedImage && (
        <OGMetaTags title={title} subtitle={subtitle} />
      )}
    </div>
  )
}
