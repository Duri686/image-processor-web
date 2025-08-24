"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Compass as Compress, FileImage, Star, Share2, Settings } from "lucide-react"

interface OperationToolbarProps {
  onCompress: (quality: number) => void
  onConvertWebP: () => void
  onGenerateFavicon: () => void
  onGenerateOG: () => void
  quality: number
  onQualityChange: (quality: number) => void
  disabled?: boolean
}

export function OperationToolbar({
  onCompress,
  onConvertWebP,
  onGenerateFavicon,
  onGenerateOG,
  quality,
  onQualityChange,
  disabled = false,
}: OperationToolbarProps) {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold font-serif">Image Operations</h2>
      </div>

      {/* Quality Control */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Compression Quality: {Math.round(quality * 100)}%</Label>
        <Slider
          value={[quality]}
          onValueChange={(value) => onQualityChange(value[0])}
          min={0.1}
          max={1}
          step={0.1}
          disabled={disabled}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Smaller file</span>
          <span>Better quality</span>
        </div>
      </div>

      {/* Operation Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button onClick={() => onCompress(quality)} disabled={disabled} className="flex items-center gap-2">
          <Compress className="w-4 h-4" />
          Compress
        </Button>

        <Button
          onClick={onConvertWebP}
          disabled={disabled}
          variant="outline"
          className="flex items-center gap-2 bg-transparent"
        >
          <FileImage className="w-4 h-4" />
          Convert WebP
        </Button>

        <Button
          onClick={onGenerateFavicon}
          disabled={disabled}
          variant="outline"
          className="flex items-center gap-2 bg-transparent"
        >
          <Star className="w-4 h-4" />
          Generate Favicon
        </Button>

        <Button
          onClick={onGenerateOG}
          disabled={disabled}
          variant="outline"
          className="flex items-center gap-2 bg-transparent"
        >
          <Share2 className="w-4 h-4" />
          Generate OG Image
        </Button>
      </div>
    </Card>
  )
}
