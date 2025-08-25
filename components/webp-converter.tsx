"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { FileImage, CheckCircle, AlertCircle, Info, Loader2, Zap } from "lucide-react"
import { toast } from "sonner"

interface WebPConverterProps {
  onConvert: (options: { quality: number; lossless?: boolean }) => void
  quality: number
  onQualityChange: (quality: number) => void
  disabled?: boolean
}

export function WebPConverter({ onConvert, quality, onQualityChange, disabled = false }: WebPConverterProps) {
  const [webpSupported, setWebpSupported] = useState<boolean | null>(null)
  const [lossless, setLossless] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [conversionSuccess, setConversionSuccess] = useState(false)

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

  const handleConvert = async () => {
    setIsConverting(true)
    setConversionSuccess(false)
    
    try {
      toast.loading("Converting to WebP format...", { 
        id: "webp-convert", 
        description: `Quality: ${lossless ? 'Lossless' : Math.round(quality * 100) + '%'}` 
      })
      
      await onConvert({ quality: lossless ? 1.0 : quality, lossless })
      
      setConversionSuccess(true)
      toast.success("WebP conversion completed!", { 
        id: "webp-convert", 
        description: "Image successfully converted to WebP format", 
        duration: 3000 
      })
      
      setTimeout(() => setConversionSuccess(false), 2000)
    } catch (error) {
      toast.error("Conversion failed", { 
        id: "webp-convert", 
        description: "Please check image format or try again", 
        duration: 4000 
      })
    } finally {
      setIsConverting(false)
    }
  }

  const getSavingsEstimate = () => {
    if (lossless) return "10-30%"
    if (quality >= 0.8) return "20-40%"
    if (quality >= 0.6) return "40-60%"
    return "60-80%"
  }

  return (
    <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/30 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
            <FileImage className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-foreground">WebP Conversion</h2>
            <p className="text-sm text-muted-foreground">Modern image format with superior compression</p>
          </div>
        </div>

        {webpSupported !== null && (
          <Badge
            variant="outline"
            className={
              webpSupported
                ? "flex items-center gap-2 px-3 py-1.5 text-sm bg-primary/10 text-primary border-primary/20 rounded-xl"
                : "flex items-center gap-2 px-3 py-1.5 text-sm bg-amber-50 text-amber-700 border-amber-200 rounded-xl"
            }
          >
            {webpSupported ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Supported
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                Limited Support
              </>
            )}
          </Badge>
        )}
      </div>

      {/* Browser Support Alert */}
      {webpSupported === false && (
        <div className="p-4 rounded-xl bg-amber-50/80 backdrop-blur-sm border border-amber-200/50">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Limited WebP Support</p>
              <p className="text-amber-700">Your browser has limited WebP support. Images will still convert, but preview may not work properly.</p>
            </div>
          </div>
        </div>
      )}

      {/* WebP Benefits */}
      <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/30">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <h3 className="text-lg font-semibold font-serif text-foreground">WebP Benefits</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <div className="px-3 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">{getSavingsEstimate()}</span>
            </div>
            <span className="text-sm font-medium text-foreground">Smaller file sizes</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Better compression</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Supports transparency</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Modern browser support</span>
          </div>
        </div>
      </div>

      {/* Conversion Options */}
      <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/30 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <h3 className="text-lg font-semibold font-serif text-foreground">Conversion Settings</h3>
        </div>

        {/* Lossless Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 border border-white/40">
          <div className="space-y-1">
            <Label className="text-base font-medium text-foreground">Lossless Compression</Label>
            <p className="text-sm text-muted-foreground">Perfect quality, larger file size</p>
          </div>
          <Switch checked={lossless} onCheckedChange={setLossless} disabled={disabled} />
        </div>

        {/* Quality Control (only for lossy) */}
        {!lossless && (
          <div className="space-y-4 p-4 rounded-xl bg-white/50 border border-white/40">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium text-foreground">WebP Quality</Label>
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
        )}

        {/* Estimated Savings */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Estimated size reduction</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary font-bold">
              {getSavingsEstimate()}
            </div>
          </div>
        </div>

        {/* Convert Button */}
        <Button 
          onClick={handleConvert} 
          disabled={disabled || isConverting} 
          className={`cursor-pointer w-full h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${
            conversionSuccess 
              ? 'bg-primary/90 hover:bg-primary text-primary-foreground border-2 border-primary' 
              : isConverting 
                ? 'bg-primary/70 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary/90'
          }`}
          size="lg"
        >
          {isConverting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Converting...
            </>
          ) : conversionSuccess ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Conversion Complete
            </>
          ) : (
            <>
              <FileImage className="w-5 h-5 mr-2" />
              Convert to WebP
            </>
          )}
        </Button>
      </div>

      {/* Format Comparison */}
      <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/30">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <h3 className="text-lg font-semibold font-serif text-foreground">Format Comparison</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/50 rounded-xl border border-white/40 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
              <span className="text-gray-600 font-bold text-sm">JPEG</span>
            </div>
            <div className="font-semibold text-foreground mb-1">JPEG</div>
            <div className="text-sm text-muted-foreground">Lossy compression only</div>
          </div>
          <div className="p-4 bg-white/50 rounded-xl border border-white/40 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">PNG</span>
            </div>
            <div className="font-semibold text-foreground mb-1">PNG</div>
            <div className="text-sm text-muted-foreground">Lossless compression only</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/30 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/30 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="font-semibold text-primary mb-1">WebP</div>
            <div className="text-sm text-muted-foreground">Both compression types</div>
          </div>
        </div>
      </div>
    </div>
  )
}
