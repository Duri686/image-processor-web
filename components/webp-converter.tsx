"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { FileImage, CheckCircle, AlertCircle, Info, Loader2 } from "lucide-react"
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

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
    setErrorMsg(null)
    
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
      setErrorMsg("Conversion failed. Please check the image format and try again.")
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
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileImage className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">WebP Conversion</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Modern image format with superior compression</p>
          </div>
        </div>

        {webpSupported !== null && (
          <Badge
            variant="outline"
            className={
              webpSupported
                ? "flex items-center gap-2 px-3 py-1 text-sm rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200 dark:border-green-700"
                : "flex items-center gap-2 px-3 py-1 text-sm rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
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
        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-300">
            <span className="font-medium">Limited WebP Support:</span> Your browser has limited WebP support. Images will still convert, but preview may not work properly.
          </AlertDescription>
        </Alert>
      )}

      {/* WebP Benefits */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">WebP Benefits</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs font-bold">
              {getSavingsEstimate()}
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Smaller files</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Better compression</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Transparency</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Modern support</span>
          </div>
        </div>
      </div>

      {/* Conversion Settings */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Conversion Settings</h3>

        {/* Lossless Toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div>
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Lossless Compression</Label>
            <p className="text-xs text-gray-600 dark:text-gray-400">Perfect quality, larger file size</p>
          </div>
          <Switch checked={lossless} onCheckedChange={setLossless} disabled={disabled} />
        </div>

        {/* Quality Control (only for lossy) */}
        {!lossless && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">WebP Quality</Label>
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
        )}

        {/* Estimated Savings */}
        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-300">
            <span className="font-medium">Estimated size reduction:</span> {getSavingsEstimate()}
          </AlertDescription>
        </Alert>

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
              Convert to WebP
            </>
          )}
        </Button>

        {/* Feedback States */}
        {conversionSuccess && (
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
            <AlertDescription className="text-green-800 dark:text-green-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Conversion complete
            </AlertDescription>
          </Alert>
        )}
        {errorMsg && (
          <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
            <AlertDescription className="text-red-800 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {errorMsg}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Format Comparison */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Format Comparison</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
            <div className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">JPEG</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Lossy only</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
            <div className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">PNG</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Lossless only</div>
          </div>
          <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg text-center border border-primary/20 dark:border-primary/30">
            <div className="text-xs font-bold text-primary mb-1 flex items-center justify-center gap-1">
              <CheckCircle className="w-3 h-3" />
              WebP
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-300">Both types</div>
          </div>
        </div>
      </div>
    </div>
  )
}
