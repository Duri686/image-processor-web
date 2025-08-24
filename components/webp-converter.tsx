"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { FileImage, CheckCircle, AlertCircle, Info } from "lucide-react"

interface WebPConverterProps {
  onConvert: (options: { quality: number; lossless?: boolean }) => void
  quality: number
  onQualityChange: (quality: number) => void
  disabled?: boolean
}

export function WebPConverter({ onConvert, quality, onQualityChange, disabled = false }: WebPConverterProps) {
  const [webpSupported, setWebpSupported] = useState<boolean | null>(null)
  const [lossless, setLossless] = useState(false)

  // Check WebP support
  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement("canvas")
      canvas.width = 1
      canvas.height = 1
      const dataURL = canvas.toDataURL("image/webp")
      setWebpSupported(dataURL.indexOf("data:image/webp") === 0)
    }

    checkWebPSupport()
  }, [])

  const handleConvert = () => {
    onConvert({ quality: lossless ? 1.0 : quality, lossless })
  }

  const getSavingsEstimate = () => {
    if (lossless) return "10-30%"
    if (quality >= 0.8) return "20-40%"
    if (quality >= 0.6) return "40-60%"
    return "60-80%"
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileImage className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold font-serif">WebP Conversion</h2>
        </div>

        {webpSupported !== null && (
          <Badge
            variant="outline"
            className={
              webpSupported
                ? "flex items-center gap-1 px-2 py-0.5 text-[12px] bg-emerald-50 text-emerald-700 border-emerald-200"
                : "flex items-center gap-1 px-2 py-0.5 text-[12px] bg-amber-50 text-amber-700 border-amber-200"
            }
          >
            {webpSupported ? (
              <>
                <CheckCircle className="w-3 h-3" />
                Supported
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3" />
                Limited Support
              </>
            )}
          </Badge>
        )}
      </div>

      {/* Browser Support Alert */}
      {webpSupported === false && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Your browser has limited WebP support. Images will still convert, but preview may not work properly.
          </AlertDescription>
        </Alert>
      )}

      {/* WebP Benefits */}
      <div className="space-y-3">
        <div className="text-sm text-muted-foreground">
          <p className="text-sm font-medium mb-2 text-foreground">WebP Benefits</p>
          <ul className="space-y-1 text-xs">
            <li className="leading-relaxed">• {getSavingsEstimate()} smaller file sizes</li>
            <li className="leading-relaxed">• Better compression than JPEG/PNG</li>
            <li className="leading-relaxed">• Supports transparency and animation</li>
            <li className="leading-relaxed">• Widely supported by modern browsers</li>
          </ul>
        </div>
      </div>

      {/* Conversion Options */}
      <div className="space-y-4">
        {/* Lossless Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium">Lossless Compression</Label>
            <p className="text-xs text-muted-foreground">Perfect quality, larger file size</p>
          </div>
          <Switch checked={lossless} onCheckedChange={setLossless} disabled={disabled} />
        </div>

        {/* Quality Control (only for lossy) */}
        {!lossless && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">WebP Quality: {Math.round(quality * 100)}%</Label>
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

        {/* Estimated Savings */}
        <div className="p-3 rounded-lg border bg-muted/60">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estimated size reduction</span>
            <Badge variant="secondary" className="ml-2 text-[11px] leading-none">
              {getSavingsEstimate()}
            </Badge>
          </div>
        </div>

        {/* Convert Button */}
        <Button onClick={handleConvert} disabled={disabled} className="w-full" size="lg">
          <FileImage className="w-4 h-4 mr-2" />
          Convert to WebP
        </Button>
      </div>

      {/* Format Comparison */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Format Comparison</Label>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 bg-muted rounded text-center">
            <div className="font-medium">JPEG</div>
            <div className="text-muted-foreground">Lossy only</div>
          </div>
          <div className="p-2 bg-muted rounded text-center">
            <div className="font-medium">PNG</div>
            <div className="text-muted-foreground">Lossless only</div>
          </div>
          <div className="p-2 bg-primary/10 rounded text-center border border-primary/20">
            <div className="font-medium text-primary">WebP</div>
            <div className="text-muted-foreground">Both options</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
