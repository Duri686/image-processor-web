"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, FileImage, Loader2 } from "lucide-react"

interface FormatConverterProps {
  onConvert: (format: "jpeg" | "png" | "webp", quality: number) => void
  quality: number
  onQualityChange: (quality: number) => void
  disabled?: boolean
}

export function FormatConverter({ onConvert, quality, onQualityChange, disabled = false }: FormatConverterProps) {
  const [selectedFormat, setSelectedFormat] = useState<"jpeg" | "png" | "webp">("webp")
  const [isConverting, setIsConverting] = useState(false)
  const [conversionSuccess, setConversionSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const formatInfo = {
    jpeg: {
      name: "JPEG",
      description: "Best for photos, smaller files",
      supportsTransparency: false,
      compression: "Lossy",
      savings: "60-80%",
      color: "bg-accent text-foreground",
    },
    png: {
      name: "PNG",
      description: "Best for graphics, supports transparency",
      supportsTransparency: true,
      compression: "Lossless",
      savings: "10-30%",
      color: "bg-accent text-foreground",
    },
    webp: {
      name: "WebP",
      description: "Modern format, best compression",
      supportsTransparency: true,
      compression: "Both",
      savings: "20-50%",
      color: "bg-accent text-foreground",
    },
  }

  const currentFormat = formatInfo[selectedFormat]
  const showQualitySlider = selectedFormat !== "png"

  const handleConvert = async () => {
    setIsConverting(true)
    setConversionSuccess(false)
    setErrorMsg(null)
    try {
      const finalQuality = selectedFormat === "png" ? 1.0 : quality
      await onConvert(selectedFormat, finalQuality)
      setConversionSuccess(true)
      setTimeout(() => setConversionSuccess(false), 2000)
    } catch (e) {
      setErrorMsg("Conversion failed. Please check the image and try again.")
    } finally {
      setIsConverting(false)
    }
  }

  const handleQuickConvert = async (format: "jpeg" | "png" | "webp") => {
    setIsConverting(true)
    setConversionSuccess(false)
    setErrorMsg(null)
    try {
      setSelectedFormat(format)
      const finalQuality = format === "png" ? 1.0 : quality
      await onConvert(format, finalQuality)
      setConversionSuccess(true)
      setTimeout(() => setConversionSuccess(false), 1500)
    } catch (e) {
      setErrorMsg("Quick convert failed. Please try again.")
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <RefreshCw className="w-5 h-5 text-primary" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Format Conversion</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Convert images to different formats with optimal settings</p>
        </div>
      </div>

      {/* Format Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Format Selection</h3>
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Target Format</Label>
          <Select value={selectedFormat} onValueChange={(value: "jpeg" | "png" | "webp") => setSelectedFormat(value)}>
            <SelectTrigger className="h-12 rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-lg bg-white dark:bg-gray-700 shadow-lg">
              <SelectItem value="webp">
                <div className="flex items-center gap-2">
                  <span>WebP</span>
                  <Badge variant="outline" className="text-xs bg-primary/10 dark:bg-primary/20 text-primary border-primary/20 dark:border-primary/30">
                    Recommended
                  </Badge>
                </div>
              </SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Format Info Card */}
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">{currentFormat.name}</h4>
              <Badge variant="outline" className="text-xs bg-primary/10 dark:bg-primary/20 text-primary border-primary/20 dark:border-primary/30">
                {currentFormat.compression}
              </Badge>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{currentFormat.description}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Transparency:</span>
                <Badge variant={currentFormat.supportsTransparency ? "default" : "secondary"} className="text-xs">
                  {currentFormat.supportsTransparency ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Savings:</span>
                <Badge variant="secondary" className="text-xs font-bold">
                  {currentFormat.savings}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Control */}
      {showQualitySlider && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quality Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Quality</Label>
              <div className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-mono">
                {Math.round(quality * 100)}%
              </div>
            </div>
            <Slider
              value={[quality]}
              onValueChange={(value) => onQualityChange(value[0])}
              min={0.1}
              max={1}
              step={0.05}
              disabled={disabled}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>
        </div>
      )}

      {selectedFormat === "png" && (
        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <AlertDescription className="text-blue-800 dark:text-blue-300">
            <span className="font-medium">Lossless Compression:</span> PNG uses lossless compression. Quality setting doesn't apply - images maintain perfect quality.
          </AlertDescription>
        </Alert>
      )}

      {/* Convert Button */}
      <Button
        onClick={handleConvert}
        disabled={disabled || isConverting}
        className="w-full h-12 rounded-lg font-medium"
      >
        {isConverting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Converting...
          </>
        ) : (
          <>
            <FileImage className="w-4 h-4 mr-2" />
            Convert to {currentFormat.name}
          </>
        )}
      </Button>

      {/* Feedback States */}
      {conversionSuccess && (
        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
          <AlertDescription className="text-green-800 dark:text-green-300">
            Conversion complete
          </AlertDescription>
        </Alert>
      )}
      {errorMsg && (
        <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
          <AlertDescription className="text-red-800 dark:text-red-300">
            {errorMsg}
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Format Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Convert</h3>
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickConvert("jpeg")}
            disabled={disabled || isConverting}
            className={`h-10 rounded-lg ${
              selectedFormat === "jpeg" ? "bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-gray-700 dark:text-gray-300 font-bold text-xs">J</span>
              </div>
              {isConverting && selectedFormat === "jpeg" ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <span className="text-xs">JPEG</span>
              )}
            </div>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickConvert("png")}
            disabled={disabled || isConverting}
            className={`h-10 rounded-lg ${
              selectedFormat === "png" ? "bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-gray-700 dark:text-gray-300 font-bold text-xs">P</span>
              </div>
              {isConverting && selectedFormat === "png" ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <span className="text-xs">PNG</span>
              )}
            </div>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickConvert("webp")}
            disabled={disabled || isConverting}
            className={`h-10 rounded-lg ${
              selectedFormat === "webp" ? "bg-primary/10 dark:bg-primary/20 border-primary/20 dark:border-primary/30" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-xs">W</span>
              </div>
              {isConverting && selectedFormat === "webp" ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <span className="text-xs">WebP</span>
              )}
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
