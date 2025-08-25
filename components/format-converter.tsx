"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
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
    try {
      const finalQuality = selectedFormat === "png" ? 1.0 : quality
      await onConvert(selectedFormat, finalQuality)
    } finally {
      setIsConverting(false)
    }
  }

  const handleQuickConvert = async (format: "jpeg" | "png" | "webp") => {
    setIsConverting(true)
    try {
      setSelectedFormat(format)
      const finalQuality = format === "png" ? 1.0 : quality
      await onConvert(format, finalQuality)
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/30 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
          <RefreshCw className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-serif text-foreground">Format Conversion</h2>
          <p className="text-sm text-muted-foreground">Convert images to different formats with optimal settings</p>
        </div>
      </div>

      {/* Format Selection */}
      <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/30 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <h3 className="text-lg font-semibold font-serif text-foreground">Format Selection</h3>
        </div>
        <div className="space-y-3">
          <Label className="text-base font-medium text-foreground">Target Format</Label>
          <Select value={selectedFormat} onValueChange={(value: "jpeg" | "png" | "webp") => setSelectedFormat(value)}>
            <SelectTrigger className="h-12 rounded-xl bg-white/50 border-white/40 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/40">
              <SelectItem value="webp" className="cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="px-3 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold text-xs">W</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">WebP</span>
                    <Badge variant="default" className="text-xs bg-primary/20 text-primary border-primary/30">
                      Recommended
                    </Badge>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="jpeg" className="cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="px-3 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-xs">J</span>
                  </div>
                  <span className="font-medium">JPEG</span>
                </div>
              </SelectItem>
              <SelectItem value="png" className="cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="px-3 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-xs">P</span>
                  </div>
                  <span className="font-medium">PNG</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Format Info Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-foreground">{currentFormat.name}</h4>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                {currentFormat.compression}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{currentFormat.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/50">
                <span className="text-sm font-medium text-foreground">Transparency:</span>
                <Badge variant={currentFormat.supportsTransparency ? "default" : "secondary"} className="text-xs">
                  {currentFormat.supportsTransparency ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/50">
                <span className="text-sm font-medium text-foreground">Typical savings:</span>
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
        <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/30 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <h3 className="text-lg font-semibold font-serif text-foreground">Quality Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium text-foreground">Quality</Label>
              <div className="px-3 py-1 rounded-lg bg-primary/20 text-primary font-bold text-sm">
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
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>
        </div>
      )}

      {selectedFormat === "png" && (
        <div className="p-4 rounded-xl bg-blue-50/80 backdrop-blur-sm border border-blue-200/50">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold text-xs">PNG</span>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Lossless Compression</p>
              <p className="text-blue-700">PNG uses lossless compression. Quality setting doesn't apply - images maintain perfect quality.</p>
            </div>
          </div>
        </div>
      )}

      {/* Convert Button */}
      <Button
        onClick={handleConvert}
        disabled={disabled || isConverting}
        className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg transition-all duration-200"
      >
        {isConverting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Converting...
          </>
        ) : (
          <>
            <FileImage className="w-5 h-5 mr-2" />
            Convert to {currentFormat.name}
          </>
        )}
      </Button>

      {/* Quick Format Buttons */}
      <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/30">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <h3 className="text-lg font-semibold font-serif text-foreground">Quick Convert</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickConvert("jpeg")}
            disabled={disabled || isConverting}
            className={`cursor-pointer h-10 rounded-xl transition-all duration-200 ${
              selectedFormat === "jpeg"
                ? "bg-orange-100 hover:bg-orange-200 border-orange-300 shadow-md"
                : "bg-white/50 hover:bg-white/70 border-white/40"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded flex items-center justify-center ${
                selectedFormat === "jpeg" ? "bg-orange-200" : "bg-orange-100"
              }`}>
                <span className="text-orange-600 font-bold text-xs">J</span>
              </div>
              {isConverting && selectedFormat === "jpeg" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className={selectedFormat === "jpeg" ? "font-semibold" : ""}>JPEG</span>
              )}
            </div>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickConvert("png")}
            disabled={disabled || isConverting}
            className={`cursor-pointer h-10 rounded-xl transition-all duration-200 ${
              selectedFormat === "png"
                ? "bg-blue-100 hover:bg-blue-200 border-blue-300 shadow-md"
                : "bg-white/50 hover:bg-white/70 border-white/40"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded flex items-center justify-center ${
                selectedFormat === "png" ? "bg-blue-200" : "bg-blue-100"
              }`}>
                <span className="text-blue-600 font-bold text-xs">P</span>
              </div>
              {isConverting && selectedFormat === "png" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className={selectedFormat === "png" ? "font-semibold" : ""}>PNG</span>
              )}
            </div>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickConvert("webp")}
            disabled={disabled || isConverting}
            className={`cursor-pointer h-10 rounded-xl transition-all duration-200 ${
              selectedFormat === "webp"
                ? "bg-primary/20 hover:bg-primary/30 border-primary/40 shadow-md"
                : "bg-primary/10 hover:bg-primary/20 border-primary/30"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded flex items-center justify-center ${
                selectedFormat === "webp" ? "bg-primary/30" : "bg-primary/20"
              }`}>
                <span className="text-primary font-bold text-xs">W</span>
              </div>
              {isConverting && selectedFormat === "webp" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className={selectedFormat === "webp" ? "font-semibold" : ""}>WebP</span>
              )}
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
