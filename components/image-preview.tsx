"use client"

import { useState } from "react"
import { X, Download, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatFileSize } from "@/lib/image-processing"
import { cn } from "@/lib/utils"

interface ImagePreviewProps {
  file: File
  processedImage?: {
    blob: Blob
    dataUrl: string
    originalSize: number
    compressedSize: number
    compressionRatio: number
    width: number
    height: number
  }
  onRemove: () => void
  onDownload?: () => void
  className?: string
}

export function ImagePreview({ file, processedImage, onRemove, onDownload, className }: ImagePreviewProps) {
  const [showComparison, setShowComparison] = useState(false)
  const [originalDataUrl, setOriginalDataUrl] = useState<string>("")

  // Load original image for preview
  useState(() => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setOriginalDataUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })

  const toggleComparison = () => {
    setShowComparison(!showComparison)
  }

  return (
    <Card className={cn("p-4 space-y-4", className)}>
      {/* Header with file info and controls */}
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{file.name}</h3>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)} • {file.type}
          </p>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {processedImage && (
            <Button variant="outline" size="sm" onClick={toggleComparison} className="h-8 px-2 bg-transparent">
              {showComparison ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </Button>
          )}

          {onDownload && processedImage && (
            <Button variant="default" size="sm" onClick={onDownload} className="h-8 px-2">
              <Download className="w-3 h-3" />
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="h-8 px-2 text-destructive hover:text-destructive bg-transparent"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Image preview area */}
      <div className="space-y-3">
        {showComparison && processedImage ? (
          // Side-by-side comparison
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Original</div>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                {originalDataUrl && (
                  <img
                    src={originalDataUrl || "/placeholder.svg"}
                    alt="Original"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="text-xs text-muted-foreground">{formatFileSize(file.size)}</div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Optimized</div>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={processedImage.dataUrl || "/placeholder.svg"}
                  alt="Optimized"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {formatFileSize(processedImage.compressedSize)}
                <span className="text-primary ml-1">(-{processedImage.compressionRatio.toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        ) : (
          // Single image view
          <div className="space-y-2">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {processedImage ? (
                <img
                  src={processedImage.dataUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : originalDataUrl ? (
                <img
                  src={originalDataUrl || "/placeholder.svg"}
                  alt="Original"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-sm text-muted-foreground">Loading...</div>
                </div>
              )}
            </div>

            {processedImage && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {processedImage.width} × {processedImage.height}
                </span>
                <span>
                  {formatFileSize(processedImage.compressedSize)}
                  <span className="text-primary ml-1">(-{processedImage.compressionRatio.toFixed(1)}%)</span>
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
