"use client"

import { useState } from "react"
import { Upload, Download, Settings, Zap, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MobileActionBarProps {
  hasImages: boolean
  processedCount: number
  onUpload: () => void
  onDownloadAll?: () => void
  onQuickCompress?: () => void
  onSettings?: () => void
  className?: string
}

export function MobileActionBar({
  hasImages,
  processedCount,
  onUpload,
  onDownloadAll,
  onQuickCompress,
  onSettings,
  className
}: MobileActionBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={cn("md:hidden", className)}>
      {/* 移动端底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 主要操作按钮 */}
            <div className="flex items-center gap-3">
              <Button
                onClick={onUpload}
                size="lg"
                className="h-12 px-6 bg-primary hover:bg-primary/90 text-white rounded-full shadow-md"
              >
                <Upload className="w-5 h-5 mr-2" />
                上传图片
              </Button>

              {hasImages && (
                <Button
                  onClick={onQuickCompress}
                  variant="outline"
                  size="lg"
                  className="h-12 px-4 rounded-full border-primary/20 hover:bg-primary/5"
                >
                  <Zap className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* 次要操作和状态 */}
            <div className="flex items-center gap-2">
              {processedCount > 0 && (
                <Badge variant="secondary" className="px-2 py-1 text-xs">
                  {processedCount} 已处理
                </Badge>
              )}

              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                variant="ghost"
                size="sm"
                className="h-10 w-10 rounded-full"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 展开的操作菜单 */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="grid grid-cols-3 gap-2">
                {onDownloadAll && processedCount > 0 && (
                  <Button
                    onClick={() => {
                      onDownloadAll()
                      setIsExpanded(false)
                    }}
                    variant="outline"
                    size="sm"
                    className="h-10 text-xs"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    全部下载
                  </Button>
                )}

                {onSettings && (
                  <Button
                    onClick={() => {
                      onSettings()
                      setIsExpanded(false)
                    }}
                    variant="outline"
                    size="sm"
                    className="h-10 text-xs"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    设置
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部安全区域占位 */}
      <div className="h-20" />
    </div>
  )
}

// 移动端快速操作浮动按钮
interface MobileFloatingActionProps {
  onAction: () => void
  icon: React.ReactNode
  label: string
  variant?: "primary" | "secondary"
  className?: string
}

export function MobileFloatingAction({
  onAction,
  icon,
  label,
  variant = "primary",
  className
}: MobileFloatingActionProps) {
  return (
    <div className={cn("md:hidden fixed bottom-6 right-6 z-50", className)}>
      <Button
        onClick={onAction}
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-200 hover:scale-105",
          variant === "primary" 
            ? "bg-primary hover:bg-primary/90 text-white" 
            : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
        )}
        aria-label={label}
      >
        {icon}
      </Button>
    </div>
  )
}

// 移动端手势提示组件
interface MobileGestureHintProps {
  show: boolean
  message: string
  onDismiss: () => void
}

export function MobileGestureHint({ show, message, onDismiss }: MobileGestureHintProps) {
  if (!show) return null

  return (
    <div className="md:hidden fixed top-20 left-4 right-4 z-50">
      <div className="bg-primary/90 text-white px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{message}</p>
          <Button
            onClick={onDismiss}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-white hover:bg-white/20"
          >
            ×
          </Button>
        </div>
      </div>
    </div>
  )
}
