"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Upload, ImageIcon, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ImageUploaderProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  multiple?: boolean
  className?: string
}

export function ImageUploader({ onFilesSelected, accept = "image/*", multiple = true, className }: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const allFiles = Array.from(e.dataTransfer.files)
      const imageFiles = allFiles.filter((file) => file.type.startsWith("image/"))
      const rejectedFiles = allFiles.filter((file) => !file.type.startsWith("image/"))

      if (rejectedFiles.length > 0) {
        toast.error("Invalid file type", {
          description: `${rejectedFiles.length} file(s) were rejected. Only image files are supported.`,
          duration: 4000,
        })
      }

      if (imageFiles.length > 0) {
        setIsUploading(true)
        
        // 模拟上传过程
        setTimeout(() => {
          onFilesSelected(imageFiles)
          setIsUploading(false)
          
          toast.success("Images uploaded successfully", {
            description: `${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} ready for processing`,
            duration: 3000,
          })
        }, 500)
      } else if (rejectedFiles.length === 0) {
        toast.error("No files selected", {
          description: "Please select at least one image file to upload.",
          duration: 3000,
        })
      }
    },
    [onFilesSelected],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const allFiles = Array.from(e.target.files || [])
      const imageFiles = allFiles.filter((file) => file.type.startsWith("image/"))
      const rejectedFiles = allFiles.filter((file) => !file.type.startsWith("image/"))

      if (rejectedFiles.length > 0) {
        toast.error("Invalid file type", {
          description: `${rejectedFiles.length} file(s) were rejected. Only image files are supported.`,
          duration: 4000,
        })
      }

      if (imageFiles.length > 0) {
        setIsUploading(true)
        
        // 模拟上传过程
        setTimeout(() => {
          onFilesSelected(imageFiles)
          setIsUploading(false)
          
          toast.success("Images uploaded successfully", {
            description: `${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} ready for processing`,
            duration: 3000,
          })
        }, 500)
      } else if (rejectedFiles.length === 0) {
        toast.error("No files selected", {
          description: "Please select at least one image file to upload.",
          duration: 3000,
        })
      }

      // 重置input值，允许重复选择相同文件
      e.target.value = ""
    },
    [onFilesSelected],
  )

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-2xl transition-all duration-300 bg-white shadow-lg shadow-gray-200/50",
        isDragOver 
          ? "border-primary/30 bg-primary/10 shadow-xl shadow-primary/25 scale-[1.02]" 
          : "border-gray-300 hover:border-primary/60 hover:bg-white hover:shadow-xl hover:shadow-gray-200/60",
        isUploading && "border-green-400 bg-green-50/80 shadow-lg shadow-green-200/50",
        className,
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        disabled={isUploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />

      <div className="flex flex-col items-center justify-center p-12 md:p-16 text-center">
        {/* 图标容器 - 符合UI规范的设计 */}
        <div className={cn(
          "mb-8 p-6 rounded-2xl transition-all duration-300 shadow-md",
          isDragOver 
            ? "bg-primary/20 border border-primary/30 scale-110 shadow-lg shadow-primary/20" 
            : isUploading 
              ? "bg-green-100 border border-green-300 shadow-lg shadow-green-200/50"
              : "bg-gray-100/80 border border-gray-200 shadow-sm"
        )}>
          {isUploading ? (
            <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-green-600 animate-pulse" />
          ) : isDragOver ? (
            <Upload className="w-10 h-10 md:w-12 md:h-12 text-primary animate-bounce" />
          ) : (
            <ImageIcon className="w-10 h-10 md:w-12 md:h-12 text-gray-500" />
          )}
        </div>

        {/* 标题和描述区域 */}
        <div className="space-y-3 mb-8">
          <h3 className="text-2xl md:text-3xl font-bold font-serif text-gray-900">
            {isUploading 
              ? "Processing..." 
              : isDragOver 
                ? "Drop images here" 
                : "Upload Images"
            }
          </h3>

          <p className="text-base md:text-lg text-gray-600 max-w-md leading-relaxed">
            {isUploading 
              ? "Your images are being prepared for processing"
              : "Drag and drop your images here, or click to browse"
            }
          </p>
        </div>

        {/* 支持格式信息卡片 - 符合信息提示设计规范 */}
        <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <p className="text-sm font-semibold">Supported formats</p>
          </div>
          <p className="text-sm text-blue-600 font-medium">JPEG, PNG, WebP • Max 10MB per file</p>
        </div>
      </div>
    </div>
  )
}
