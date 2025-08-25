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
        "relative border-2 border-dashed rounded-xl transition-all duration-300 bg-white/60 backdrop-blur-sm shadow-lg",
        isDragOver 
          ? "border-primary bg-primary/10 shadow-xl scale-[1.02]" 
          : "border-gray-300 hover:border-primary/60 hover:bg-white/80 hover:shadow-xl",
        isUploading && "border-green-400 bg-green-50/60",
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

      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className={cn(
          "mb-6 p-4 rounded-xl transition-all duration-300",
          isDragOver 
            ? "bg-primary/20 border border-primary/30 scale-110" 
            : isUploading 
              ? "bg-green-100 border border-green-300"
              : "bg-gray-100/60 border border-gray-200"
        )}>
          {isUploading ? (
            <CheckCircle className="w-8 h-8 text-green-600 animate-pulse" />
          ) : isDragOver ? (
            <Upload className="w-8 h-8 text-primary animate-bounce" />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-500" />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold font-serif text-gray-900">
            {isUploading 
              ? "Processing..." 
              : isDragOver 
                ? "Drop images here" 
                : "Upload Images"
            }
          </h3>

          <p className="text-sm text-gray-600 max-w-sm">
            {isUploading 
              ? "Your images are being prepared for processing"
              : "Drag and drop your images here, or click to browse"
            }
          </p>
        </div>

        <div className="mt-6 p-3 bg-blue-50/60 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-700">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <p className="text-xs font-medium">Supported formats</p>
          </div>
          <p className="text-xs text-blue-600 mt-1">JPEG, PNG, WebP • Max 10MB per file</p>
        </div>
      </div>
    </div>
  )
}
