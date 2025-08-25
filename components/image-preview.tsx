"use client"

import { useState, useRef, useCallback } from "react"
import { X, Download, Eye, EyeOff, MoreVertical, Copy, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
  const [isLongPressing, setIsLongPressing] = useState(false)
  const [touchStartTime, setTouchStartTime] = useState(0)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const touchStartPos = useRef({ x: 0, y: 0 })

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

  // 移动端长按交互
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartPos.current = { x: touch.clientX, y: touch.clientY }
    setTouchStartTime(Date.now())
    
    longPressTimer.current = setTimeout(() => {
      setIsLongPressing(true)
      // 触觉反馈
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    }, 500) // 500ms 长按触发
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!longPressTimer.current) return
    
    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - touchStartPos.current.x)
    const deltaY = Math.abs(touch.clientY - touchStartPos.current.y)
    
    // 如果移动距离超过阈值，取消长按
    if (deltaX > 10 || deltaY > 10) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    
    const touchDuration = Date.now() - touchStartTime
    
    // 短按切换对比视图
    if (touchDuration < 500 && processedImage) {
      toggleComparison()
    }
    
    setIsLongPressing(false)
  }, [processedImage])

  // 复制图片到剪贴板
  const handleCopyImage = useCallback(async () => {
    if (!processedImage) return
    
    try {
      const item = new ClipboardItem({
        [processedImage.blob.type]: processedImage.blob
      })
      await navigator.clipboard.write([item])
      // 这里可以添加toast提示
    } catch (error) {
      console.error('Failed to copy image:', error)
    }
  }, [processedImage])

  // 分享图片
  const handleShareImage = useCallback(async () => {
    if (!processedImage || !navigator.share) return
    
    try {
      const shareFile = new File([processedImage.blob], file.name, {
        type: processedImage.blob.type
      })
      
      await navigator.share({
        files: [shareFile],
        title: 'Optimized Image',
        text: `Optimized ${file.name}`
      })
    } catch (error) {
      console.error('Failed to share image:', error)
    }
  }, [processedImage, file.name])

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
          {/* 桌面端按钮 */}
          <div className="hidden md:flex items-center gap-2">
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

          {/* 移动端下拉菜单 */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2 bg-transparent">
                  <MoreVertical className="w-3 h-3" />
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
                
                {processedImage && navigator.clipboard && (
                  <DropdownMenuItem onClick={handleCopyImage}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Image
                  </DropdownMenuItem>
                )}
                
                {processedImage && typeof navigator !== 'undefined' && navigator.share && (
                  <DropdownMenuItem onClick={handleShareImage}>
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem onClick={onRemove} className="text-destructive">
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Image preview area */}
      <div className="space-y-3">
        {showComparison && processedImage ? (
          // Side-by-side comparison
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Original</div>
              <div 
                className={cn(
                  "bg-muted rounded-lg overflow-hidden h-40 md:h-48 border transition-all duration-200",
                  isLongPressing && "ring-2 ring-primary/50 scale-[0.98]"
                )}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {originalDataUrl && (
                  <img
                    src={originalDataUrl || "/placeholder.svg"}
                    alt="Original"
                    className="w-full h-full object-contain select-none"
                    loading="lazy"
                    draggable={false}
                  />
                )}
              </div>
              <div className="text-xs text-muted-foreground">{formatFileSize(file.size)}</div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Optimized</div>
              <div 
                className={cn(
                  "bg-muted rounded-lg overflow-hidden h-40 md:h-48 border transition-all duration-200",
                  isLongPressing && "ring-2 ring-primary/50 scale-[0.98]"
                )}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={processedImage.dataUrl || "/placeholder.svg"}
                  alt="Optimized"
                  className="w-full h-full object-contain select-none"
                  loading="lazy"
                  draggable={false}
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
            <div 
              className={cn(
                "shrink-0 bg-muted rounded-lg overflow-hidden w-28 h-20 md:w-40 md:h-28 border transition-all duration-200",
                isLongPressing && "ring-2 ring-primary/50 scale-[0.98]"
              )}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={processedImage.dataUrl || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-full object-contain select-none"
                loading="lazy"
                draggable={false}
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
            <div 
              className={cn(
                "bg-muted rounded-lg overflow-hidden h-44 md:h-56 border transition-all duration-200",
                isLongPressing && "ring-2 ring-primary/50 scale-[0.98]"
              )}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {originalDataUrl ? (
                <img
                  src={originalDataUrl || "/placeholder.svg"}
                  alt="Original"
                  className="w-full h-full object-contain select-none"
                  loading="lazy"
                  draggable={false}
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
