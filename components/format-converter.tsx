"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, FileImage } from "lucide-react"

interface FormatConverterProps {
  onConvert: (format: "jpeg" | "png" | "webp", quality: number) => void
  quality: number
  onQualityChange: (quality: number) => void
  disabled?: boolean
}

export function FormatConverter({ onConvert, quality, onQualityChange, disabled = false }: FormatConverterProps) {
  const [selectedFormat, setSelectedFormat] = useState<"jpeg" | "png" | "webp">("webp")

  const formatInfo = {
    jpeg: {
      name: "JPEG",
      description: "Best for photos, smaller files",
      supportsTransparency: false,
      compression: "Lossy",
      savings: "60-80%",
      color: "bg-blue-100 text-blue-800",
    },
    png: {
      name: "PNG",
      description: "Best for graphics, supports transparency",
      supportsTransparency: true,
      compression: "Lossless",
      savings: "10-30%",
      color: "bg-green-100 text-green-800",
    },
    webp: {
      name: "WebP",
      description: "Modern format, best compression",
      supportsTransparency: true,
      compression: "Both",
      savings: "20-50%",
      color: "bg-primary/10 text-primary",
    },
  }

  const currentFormat = formatInfo[selectedFormat]
  const showQualitySlider = selectedFormat !== "png"

  const handleConvert = () => {
    const finalQuality = selectedFormat === "png" ? 1.0 : quality
    onConvert(selectedFormat, finalQuality)
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <RefreshCw className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold font-serif">Format Conversion</h2>
      </div>

      {/* Format Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Target Format</Label>
        <Select value={selectedFormat} onValueChange={(value: "jpeg" | "png" | "webp") => setSelectedFormat(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="webp">
              <div className="flex items-center gap-2">
                <span>WebP</span>
                <Badge variant="secondary" className="text-xs">
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
      <div className={`p-4 rounded-lg ${currentFormat.color}`}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{currentFormat.name}</h3>
            <Badge variant="outline" className="text-xs">
              {currentFormat.compression}
            </Badge>
          </div>
          <p className="text-sm opacity-90">{currentFormat.description}</p>
          <div className="flex items-center justify-between text-sm">
            <span>Transparency: {currentFormat.supportsTransparency ? "Yes" : "No"}</span>
            <span>Typical savings: {currentFormat.savings}</span>
          </div>
        </div>
      </div>

      {/* Quality Control */}
      {showQualitySlider && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Quality: {Math.round(quality * 100)}%</Label>
          <Slider
            value={[quality]}
            onValueChange={(value) => onQualityChange(value[0])}
            min={0.1}
            max={1}
            step={0.05}
            disabled={disabled}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Smaller file</span>
            <span>Better quality</span>
          </div>
        </div>
      )}

      {selectedFormat === "png" && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">PNG uses lossless compression. Quality setting doesn't apply.</p>
        </div>
      )}

      {/* Convert Button */}
      <Button onClick={handleConvert} disabled={disabled} className="w-full" size="lg">
        <FileImage className="w-4 h-4 mr-2" />
        Convert to {currentFormat.name}
      </Button>

      {/* Quick Format Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onConvert("jpeg", quality)}
          disabled={disabled}
          className="bg-transparent"
        >
          JPEG
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onConvert("png", 1.0)}
          disabled={disabled}
          className="bg-transparent"
        >
          PNG
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onConvert("webp", quality)}
          disabled={disabled}
          className="bg-transparent"
        >
          WebP
        </Button>
      </div>
    </Card>
  )
}
