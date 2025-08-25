"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { CompressionPreset } from "@/lib/image-processing"
import { Zap, Target, Settings2, Info, Gauge, Maximize2, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface CompressionControlsProps {
  onCompress: (options: any) => void
  quality: number
  onQualityChange: (quality: number) => void
  disabled?: boolean
}

export function CompressionControls({
  onCompress,
  quality,
  onQualityChange,
  disabled = false,
}: CompressionControlsProps) {
  const [targetSize, setTargetSize] = useState<number>(500)
  const [maxWidth, setMaxWidth] = useState<number>(1920)
  const [maxHeight, setMaxHeight] = useState<number>(1080)
  const [useTargetSize, setUseTargetSize] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<CompressionPreset>("webp_high")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingSuccess, setProcessingSuccess] = useState(false)

  const handlePresetCompress = async () => {
    // 如果按钮被禁用，直接返回
    if (disabled) {
      return
    }
    
    setIsProcessing(true)
    setProcessingSuccess(false)
    
    try {
      toast.loading("Applying preset compression...", {
        id: "preset-compress",
        description: `Using ${getPresetDisplayName(selectedPreset)} preset`
      })
      
      await onCompress({ preset: selectedPreset })
      
      setProcessingSuccess(true)
      toast.success("Preset compression completed!", {
        id: "preset-compress",
        description: "Image successfully compressed",
        duration: 3000
      })
      
      // 显示成功状态2秒后重置
      setTimeout(() => {
        setProcessingSuccess(false)
      }, 2000)
      
    } catch (error) {
      toast.error("Compression failed", {
        id: "preset-compress",
        description: "Please check image format or try again",
        duration: 4000
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getPresetDisplayName = (preset: CompressionPreset) => {
    const presetNames: { [key: string]: string } = {
      'webp_high': 'WebP High Quality',
      'webp_medium': 'WebP Medium Quality',
      'webp_small': 'WebP Small Size',
      'jpeg_high': 'JPEG High Quality',
      'jpeg_medium': 'JPEG Medium Quality',
      'png_optimized': 'PNG Optimized',
      'web': 'Web Optimized',
      'thumbnail': 'Thumbnail',
      'social': 'Social Media',
      'print': 'Print Quality',
      'lossless': 'Lossless Compression'
    }
    return presetNames[preset] || preset
  }

  const handleQualityCompress = () => {
    if (disabled) {
      return
    }
    
    onCompress({
      quality,
      maxWidth: maxWidth || undefined,
      maxHeight: maxHeight || undefined,
    })
  }

  const handleTargetSizeCompress = () => {
    if (disabled) {
      return
    }
    
    onCompress({
      targetSizeKB: targetSize,
      maxWidth: maxWidth || undefined,
      maxHeight: maxHeight || undefined,
    })
  }

  const getQualityColor = (quality: number) => {
    if (quality >= 0.8) return "text-green-600"
    if (quality >= 0.6) return "text-yellow-600"
    return "text-red-600"
  }

  const getQualityLabel = (quality: number) => {
    if (quality >= 0.9) return "Excellent"
    if (quality >= 0.8) return "High"
    if (quality >= 0.6) return "Medium"
    if (quality >= 0.4) return "Low"
    return "Very Low"
  }

  return (
    <Card className="p-4 sm:p-6 bg-white/40 backdrop-blur-sm border border-white/30">
      {/* 标题区域 - 应用设计原则 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
          <Settings2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-serif text-gray-900">Compression Settings</h2>
          <p className="text-sm text-gray-600">Optimize your images with advanced compression options</p>
        </div>
      </div>

      <Tabs defaultValue="presets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-0 rounded-xl border bg-white/80 backdrop-blur-sm p-3 sm:p-1 border-white/40">
          <TabsTrigger
            value="presets"
            className="flex items-center justify-start gap-3 h-12 sm:h-10 px-4 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-white/80 text-base sm:text-sm"
          >
            <Zap className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="font-semibold sm:font-medium">Presets</span>
          </TabsTrigger>
          <TabsTrigger
            value="quality"
            className="flex items-center justify-start gap-3 h-12 sm:h-10 px-4 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-white/80 text-base sm:text-sm"
          >
            <Gauge className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="font-semibold sm:font-medium">Quality</span>
          </TabsTrigger>
          <TabsTrigger
            value="target"
            className="flex items-center justify-start gap-3 h-12 sm:h-10 px-4 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-white/80 text-base sm:text-sm"
          >
            <Target className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="font-semibold sm:font-medium">Target Size</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="mt-4 sm:mt-6">
          <div className="p-4 sm:p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <Label className="text-base font-semibold text-gray-900">Compression Preset</Label>
            </div>
            <Select value={selectedPreset} onValueChange={(value: CompressionPreset) => setSelectedPreset(value)}>
              <SelectTrigger className="h-12 sm:h-14 rounded-xl bg-white/80 backdrop-blur-sm border border-white/40 text-base font-medium text-gray-900 hover:bg-white/90 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200">
                <SelectValue className="text-gray-900" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-white/40 bg-white/95 backdrop-blur-md shadow-lg">
                <SelectItem value="web" className="rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Web Optimized (JPEG, 80%)</span>
                  </div>
                </SelectItem>
                <SelectItem value="thumbnail" className="rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span>Thumbnail (300px, 70%)</span>
                  </div>
                </SelectItem>
                <SelectItem value="social" className="rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                    <span>Social Media (1200px, 85%)</span>
                  </div>
                </SelectItem>
                <SelectItem value="print" className="rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Print Quality (95%)</span>
                  </div>
                </SelectItem>
                <SelectItem value="lossless" className="rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                    <span>Lossless (PNG)</span>
                  </div>
                </SelectItem>
                <SelectItem value="webp_high" className="rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span>WebP High Quality</span>
                  </div>
                </SelectItem>
                <SelectItem value="webp_small" className="rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span>WebP Small Size</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Alert className="mt-4 bg-blue-50/40 backdrop-blur-sm border border-blue-200/50 rounded-xl">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                <p className="font-semibold text-gray-900 mb-1">Quick Start</p>
                <p className="text-sm text-gray-700">Choose a preset that matches your use case for optimal results with minimal configuration.</p>
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handlePresetCompress} 
              disabled={disabled || isProcessing} 
              className={`w-full h-12 sm:h-14 mt-6 rounded-xl font-medium backdrop-blur-sm transition-all duration-300 ${
                processingSuccess 
                  ? 'bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg border border-primary/30' 
                  : isProcessing 
                    ? 'bg-primary/70 text-primary-foreground cursor-not-allowed border border-primary/20' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md border border-primary/20 hover:shadow-lg'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : processingSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Compression Complete
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Apply Preset
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="mt-4 sm:mt-6 space-y-4">
          <div className="p-4 sm:p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <Label className="text-base font-semibold text-gray-900">Quality Control</Label>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 bg-gray-100 rounded-lg text-sm font-mono ${getQualityColor(quality)}`}>
                    {Math.round(quality * 100)}%
                  </div>
                  <div className={`px-2 py-1 rounded-md text-xs font-medium ${getQualityColor(quality)} bg-current/10`}>
                    {getQualityLabel(quality)}
                  </div>
                </div>
              </div>
              <Slider
                value={[quality]}
                onValueChange={(value) => onQualityChange(value[0])}
                min={0.1}
                max={1}
                step={0.05}
                disabled={disabled}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Smaller file</span>
                <span className="font-medium">Quality vs Size Balance</span>
                <span>Better quality</span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <Label className="text-base font-semibold text-gray-900">Dimension Limits</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <Label className="text-sm font-medium text-gray-900">Max Width (px)</Label>
                <Input
                  type="number"
                  value={maxWidth || ""}
                  onChange={(e) => setMaxWidth(Number(e.target.value) || 0)}
                  placeholder="Auto"
                  disabled={disabled}
                  className="h-12 sm:h-14 rounded-xl bg-white/80 backdrop-blur-sm border border-white/40 text-base text-gray-900 placeholder:text-gray-500 hover:bg-white/90 focus:bg-white/95 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Label className="text-sm font-medium text-gray-900">Max Height (px)</Label>
                <Input
                  type="number"
                  value={maxHeight || ""}
                  onChange={(e) => setMaxHeight(Number(e.target.value) || 0)}
                  placeholder="Auto"
                  disabled={disabled}
                  className="h-12 sm:h-14 rounded-xl bg-white/80 backdrop-blur-sm border border-white/40 text-base text-gray-900 placeholder:text-gray-500 hover:bg-white/90 focus:bg-white/95 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleQualityCompress} 
            disabled={disabled} 
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium shadow-md hover:bg-primary/90 transition-all"
          >
            <Gauge className="w-4 h-4 mr-2" />
            Compress with Quality
          </Button>
        </TabsContent>

        <TabsContent value="target" className="mt-4 sm:mt-6 space-y-4">
          <div className="p-4 sm:p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <Label className="text-base font-semibold text-gray-900">Target File Size</Label>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={targetSize}
                onChange={(e) => setTargetSize(Number(e.target.value) || 500)}
                disabled={disabled}
                className="flex-1 h-12 rounded-xl bg-white/90 border-gray-300 text-base text-gray-900 placeholder:text-gray-500 shadow-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                KB
              </div>
            </div>
            
            <Alert className="mt-4 bg-amber-50/60 border-amber-200">
              <Target className="h-4 w-4 text-amber-600" />
              <AlertDescription>
                <p className="font-semibold text-gray-900 mb-1">Smart Compression</p>
                <p className="text-sm text-gray-700">The tool will automatically adjust quality to reach your target file size while maintaining visual quality.</p>
              </AlertDescription>
            </Alert>
          </div>

          <div className="p-4 sm:p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <Label className="text-base font-semibold text-gray-900">Dimension Limits</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <Label className="text-sm font-medium text-gray-900">Max Width (px)</Label>
                <Input
                  type="number"
                  value={maxWidth || ""}
                  onChange={(e) => setMaxWidth(Number(e.target.value) || 0)}
                  placeholder="Auto"
                  disabled={disabled}
                  className="h-12 sm:h-14 rounded-xl bg-white/80 backdrop-blur-sm border border-white/40 text-base text-gray-900 placeholder:text-gray-500 hover:bg-white/90 focus:bg-white/95 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Label className="text-sm font-medium text-gray-900">Max Height (px)</Label>
                <Input
                  type="number"
                  value={maxHeight || ""}
                  onChange={(e) => setMaxHeight(Number(e.target.value) || 0)}
                  placeholder="Auto"
                  disabled={disabled}
                  className="h-12 sm:h-14 rounded-xl bg-white/80 backdrop-blur-sm border border-white/40 text-base text-gray-900 placeholder:text-gray-500 hover:bg-white/90 focus:bg-white/95 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleTargetSizeCompress} 
            disabled={disabled} 
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium shadow-md hover:bg-primary/90 transition-all"
          >
            <Target className="w-4 h-4 mr-2" />
            Compress to Target Size
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
