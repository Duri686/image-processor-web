"use client"

import { useState } from "react"
import { X, Download, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
        <div className="flex-1 min-w-0 overflow-hidden">
          <h3 className="font-medium text-sm truncate whitespace-nowrap text-ellipsis max-w-[60vw] md:max-w-[40rem]">
            {file.name}
          </h3>
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
              <div className="bg-muted rounded-lg overflow-hidden h-40 md:h-48 border">
                {originalDataUrl && (
                  <img
                    src={originalDataUrl || "/placeholder.svg"}
                    alt="Original"
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="text-xs text-muted-foreground">{formatFileSize(file.size)}</div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Optimized</div>
              <div className="bg-muted rounded-lg overflow-hidden h-40 md:h-48 border">
                <img
                  src={processedImage.dataUrl || "/placeholder.svg"}
                  alt="Optimized"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {formatFileSize(processedImage.compressedSize)}
                <Badge
                  variant="outline"
                  className={cn(
                    "ml-2 px-1.5 py-0 text-[11px] rounded align-middle",
                    processedImage.compressionRatio >= 0
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-red-50 text-red-700 border-red-200",
                  )}
                >
                  {processedImage.compressionRatio >= 0 ? "-" : "+"}
                  {Math.abs(processedImage.compressionRatio).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
        ) : processedImage ? (
          // Compact horizontal layout when image is processed
          <div className="flex items-center gap-4">
            <div className="shrink-0 bg-muted rounded-lg overflow-hidden w-28 h-20 md:w-40 md:h-28 border">
              <img
                src={processedImage.dataUrl || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>
                  {processedImage.width} × {processedImage.height}
                </span>
                <span>
                  {formatFileSize(processedImage.compressedSize)}
                  <Badge
                    variant="outline"
                    className={cn(
                      "ml-2 px-1.5 py-0 text-[11px] rounded align-middle",
                      processedImage.compressionRatio >= 0
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200",
                    )}
                  >
                    {processedImage.compressionRatio >= 0 ? "-" : "+"}
                    {Math.abs(processedImage.compressionRatio).toFixed(1)}%
                  </Badge>
                </span>
              </div>
            </div>
          </div>
        ) : (
          // Single image view (original only)
          <div className="space-y-2">
            <div className="bg-muted rounded-lg overflow-hidden h-44 md:h-56 border">
              {originalDataUrl ? (
                <img
                  src={originalDataUrl || "/placeholder.svg"}
                  alt="Original"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-sm text-muted-foreground">Loading...</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
