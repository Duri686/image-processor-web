"use client"

import { useState, useEffect } from "react"
import { X, Download, Eye, EyeOff, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
  useEffect(() => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setOriginalDataUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [file])

  const toggleComparison = () => {
    setShowComparison(!showComparison)
  }

  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 space-y-4 md:space-y-6", className)}>
      {/* Header with file info and controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0 overflow-hidden max-w-[200px] sm:max-w-[250px] md:max-w-none">
          <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate overflow-hidden text-ellipsis whitespace-nowrap">
            {file.name}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate overflow-hidden text-ellipsis whitespace-nowrap">
            {formatFileSize(file.size)} • {file.type}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* 桌面端按钮 */}
          <div className="hidden md:flex items-center gap-2">
            {processedImage && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleComparison} 
                className="h-10 rounded-lg"
              >
                {showComparison ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            )}

            {onDownload && processedImage && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={onDownload} 
                className="h-10 rounded-lg"
              >
                <Download className="w-4 h-4" />
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={onRemove}
              className="h-10 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* 移动端下拉菜单 */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 rounded-lg">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {processedImage && (
                  <DropdownMenuItem onClick={toggleComparison}>
                    {showComparison ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showComparison ? "Hide Comparison" : "Show Comparison"}
                  </DropdownMenuItem>
                )}
                
                {onDownload && processedImage && (
                  <DropdownMenuItem onClick={onDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem onClick={onRemove} className="text-red-600">
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Image preview area */}
      <div className="space-y-3 md:space-y-4">
        {showComparison && processedImage ? (
          // Side-by-side comparison
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Original</div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden aspect-[4/3] border border-gray-200 dark:border-gray-600">
                {originalDataUrl && (
                  <img
                    src={originalDataUrl}
                    alt="Original"
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{formatFileSize(file.size)}</div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Optimized</div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden aspect-[4/3] border border-gray-200 dark:border-gray-600">
                <img
                  src={processedImage.dataUrl}
                  alt="Optimized"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                {formatFileSize(processedImage.compressedSize)}
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    processedImage.compressionRatio >= 0
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700"
                      : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700",
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
          <div className="flex items-center gap-3 md:gap-4">
            <div className="shrink-0 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden aspect-[4/3] w-16 sm:w-20 md:w-24 border border-gray-200 dark:border-gray-600">
              <img
                src={processedImage.dataUrl}
                alt="Preview"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600 dark:text-gray-400">
                <span>
                  {processedImage.width} × {processedImage.height}
                </span>
                <div className="flex items-center gap-2">
                  <span>{formatFileSize(processedImage.compressedSize)}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      processedImage.compressionRatio >= 0
                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700"
                        : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700",
                    )}
                  >
                    {processedImage.compressionRatio >= 0 ? "-" : "+"}
                    {Math.abs(processedImage.compressionRatio).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Single image view (original only)
          <div className="space-y-2">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden aspect-[4/3] border border-gray-200 dark:border-gray-600">
              {originalDataUrl ? (
                <img
                  src={originalDataUrl}
                  alt="Original"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Loading...</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
