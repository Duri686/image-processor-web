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
import { Zap, Target, Settings2, Info, Gauge, Loader2, CheckCircle2 } from "lucide-react"
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
    if (quality >= 0.8) return "text-primary"
    if (quality >= 0.6) return "text-gray-700"
    if (quality >= 0.4) return "text-gray-700"
    return "text-gray-600"
  }

  const getQualityLabel = (quality: number) => {
    if (quality >= 0.9) return "Excellent"
    if (quality >= 0.8) return "High"
    if (quality >= 0.6) return "Medium"
    if (quality >= 0.4) return "Low"
    return "Very Low"
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
      {/* 简化的标题区域 */}
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <Settings2 className="w-5 h-5 text-primary" />
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">Compression Settings</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Optimize your images with advanced compression options</p>
        </div>
      </div>

      <Tabs defaultValue="presets" className="space-y-4 md:space-y-6">
        {/* 移动端选择器 */}
        <div className="md:hidden">
          <Select defaultValue="presets">
            <SelectTrigger className="h-12 rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
              <SelectItem value="presets">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>Presets</span>
                </div>
              </SelectItem>
              <SelectItem value="quality">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  <span>Quality</span>
                </div>
              </SelectItem>
              <SelectItem value="target">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>Target Size</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 桌面端标签页 */}
        <div className="hidden md:block">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <TabsTrigger
              value="presets"
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 data-[state=active]:shadow-sm"
            >
              <Zap className="w-4 h-4" />
              <span>Presets</span>
            </TabsTrigger>
            <TabsTrigger
              value="quality"
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 data-[state=active]:shadow-sm"
            >
              <Gauge className="w-4 h-4" />
              <span>Quality</span>
            </TabsTrigger>
            <TabsTrigger
              value="target"
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 data-[state=active]:shadow-sm"
            >
              <Target className="w-4 h-4" />
              <span>Target Size</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="presets" className="mt-4 md:mt-6 space-y-3 md:space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 block">Compression Preset</Label>
            <Select value={selectedPreset} onValueChange={(value: CompressionPreset) => setSelectedPreset(value)}>
              <SelectTrigger className="h-12 rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                <SelectItem value="web">Web Optimized (JPEG, 80%)</SelectItem>
                <SelectItem value="thumbnail">Thumbnail (300px, 70%)</SelectItem>
                <SelectItem value="social">Social Media (1200px, 85%)</SelectItem>
                <SelectItem value="print">Print Quality (95%)</SelectItem>
                <SelectItem value="lossless">Lossless (PNG)</SelectItem>
                <SelectItem value="webp_high">WebP High Quality</SelectItem>
                <SelectItem value="webp_medium">WebP Medium Quality</SelectItem>
                <SelectItem value="webp_small">WebP Small Size</SelectItem>
              </SelectContent>
            </Select>
          </div>
            
          <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-300">
              <span className="font-medium">Quick Start:</span> Choose a preset that matches your use case for optimal results.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handlePresetCompress} 
            disabled={disabled || isProcessing} 
            className="w-full h-12 rounded-lg font-medium"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : processingSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Apply Preset
              </>
            )}
          </Button>
        </TabsContent>

        <TabsContent value="quality" className="mt-4 md:mt-6 space-y-4 md:space-y-6">
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Quality Control</Label>
              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono ${getQualityColor(quality)}`}>
                  {Math.round(quality * 100)}%
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${getQualityColor(quality)} bg-current/10`}>
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
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Dimension Limits</Label>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-600 dark:text-gray-400">Max Width (px)</Label>
                <Input
                  type="number"
                  value={maxWidth || ""}
                  onChange={(e) => setMaxWidth(Number(e.target.value) || 0)}
                  placeholder="Auto"
                  disabled={disabled}
                  className="h-10 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-600 dark:text-gray-400">Max Height (px)</Label>
                <Input
                  type="number"
                  value={maxHeight || ""}
                  onChange={(e) => setMaxHeight(Number(e.target.value) || 0)}
                  placeholder="Auto"
                  disabled={disabled}
                  className="h-10 rounded-lg"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleQualityCompress} 
            disabled={disabled} 
            className="w-full h-12 rounded-lg font-medium"
          >
            <Gauge className="w-4 h-4 mr-2" />
            Compress with Quality
          </Button>
        </TabsContent>

        <TabsContent value="target" className="mt-4 md:mt-6 space-y-4 md:space-y-6">
          <div className="space-y-3 md:space-y-4">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Target File Size</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={targetSize}
                onChange={(e) => setTargetSize(Number(e.target.value) || 500)}
                disabled={disabled}
                className="flex-1 h-12 rounded-lg"
              />
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                KB
              </div>
            </div>
            
            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-300">
                <span className="font-medium">Smart Compression:</span> Automatically adjusts quality to reach your target file size.
              </AlertDescription>
            </Alert>
          </div>

          <div className="space-y-3 md:space-y-4">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Dimension Limits</Label>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-600 dark:text-gray-400">Max Width (px)</Label>
                <Input
                  type="number"
                  value={maxWidth || ""}
                  onChange={(e) => setMaxWidth(Number(e.target.value) || 0)}
                  placeholder="Auto"
                  disabled={disabled}
                  className="h-10 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-600 dark:text-gray-400">Max Height (px)</Label>
                <Input
                  type="number"
                  value={maxHeight || ""}
                  onChange={(e) => setMaxHeight(Number(e.target.value) || 0)}
                  placeholder="Auto"
                  disabled={disabled}
                  className="h-10 rounded-lg"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleTargetSizeCompress} 
            disabled={disabled} 
            className="w-full h-12 rounded-lg font-medium"
          >
            <Target className="w-4 h-4 mr-2" />
            Compress to Target Size
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
