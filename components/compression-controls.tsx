"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { CompressionPreset } from "@/lib/image-processing"
import { Zap, Target, Settings2 } from "lucide-react"

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
  const [selectedPreset, setSelectedPreset] = useState<CompressionPreset>("web")

  const handlePresetCompress = () => {
    onCompress({ preset: selectedPreset })
  }

  const handleQualityCompress = () => {
    onCompress({
      quality,
      maxWidth: maxWidth || undefined,
      maxHeight: maxHeight || undefined,
    })
  }

  const handleTargetSizeCompress = () => {
    onCompress({
      targetSizeKB: targetSize,
      maxWidth: maxWidth || undefined,
      maxHeight: maxHeight || undefined,
    })
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings2 className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold font-serif">Compression Settings</h2>
      </div>

      <Tabs defaultValue="presets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 rounded-lg border bg-muted/60 p-1 text-xs">
          <TabsTrigger
            value="presets"
            className="flex items-center gap-1 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Zap className="w-3 h-3" />
            Presets
          </TabsTrigger>
          <TabsTrigger
            value="quality"
            className="flex items-center gap-1 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Settings2 className="w-3 h-3" />
            Quality
          </TabsTrigger>
          <TabsTrigger
            value="target"
            className="flex items-center gap-1 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Target className="w-3 h-3" />
            Target Size
          </TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Compression Preset</Label>
            <Select value={selectedPreset} onValueChange={(value: CompressionPreset) => setSelectedPreset(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web">Web Optimized (JPEG, 80%)</SelectItem>
                <SelectItem value="thumbnail">Thumbnail (300px, 70%)</SelectItem>
                <SelectItem value="social">Social Media (1200px, 85%)</SelectItem>
                <SelectItem value="print">Print Quality (95%)</SelectItem>
                <SelectItem value="lossless">Lossless (PNG)</SelectItem>
                <SelectItem value="webp_high">WebP High Quality</SelectItem>
                <SelectItem value="webp_small">WebP Small Size</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handlePresetCompress} disabled={disabled} className="w-full">
              Apply Preset
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quality: {Math.round(quality * 100)}%</Label>
            <Slider
              value={[quality]}
              onValueChange={(value) => onQualityChange(value[0])}
              min={0.1}
              max={1}
              step={0.05}
              disabled={disabled}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm">Max Width (px)</Label>
              <Input
                type="number"
                value={maxWidth || ""}
                onChange={(e) => setMaxWidth(Number(e.target.value) || 0)}
                placeholder="Auto"
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Max Height (px)</Label>
              <Input
                type="number"
                value={maxHeight || ""}
                onChange={(e) => setMaxHeight(Number(e.target.value) || 0)}
                placeholder="Auto"
                disabled={disabled}
              />
            </div>
          </div>

          <Button onClick={handleQualityCompress} disabled={disabled} className="w-full">
            Compress with Quality
          </Button>
        </TabsContent>

        <TabsContent value="target" className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Target File Size</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={targetSize}
                onChange={(e) => setTargetSize(Number(e.target.value) || 500)}
                disabled={disabled}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">KB</span>
            </div>
            <p className="text-xs text-muted-foreground">
              The tool will automatically adjust quality to reach the target size
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm">Max Width (px)</Label>
              <Input
                type="number"
                value={maxWidth || ""}
                onChange={(e) => setMaxWidth(Number(e.target.value) || 0)}
                placeholder="Auto"
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Max Height (px)</Label>
              <Input
                type="number"
                value={maxHeight || ""}
                onChange={(e) => setMaxHeight(Number(e.target.value) || 0)}
                placeholder="Auto"
                disabled={disabled}
              />
            </div>
          </div>

          <Button onClick={handleTargetSizeCompress} disabled={disabled} className="w-full">
            Compress to Target Size
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
