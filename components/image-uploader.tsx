"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Upload, ImageIcon, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [pressed, setPressed] = useState(false)

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
        setErrorMsg(`${rejectedFiles.length} file(s) were rejected. Only image files are supported.`)
      }

      if (imageFiles.length > 0) {
        setIsUploading(true)
        setErrorMsg(null)
        setUploadSuccess(false)
        
        // 模拟上传过程
        setTimeout(() => {
          onFilesSelected(imageFiles)
          setIsUploading(false)
          setUploadSuccess(true)
          setTimeout(() => setUploadSuccess(false), 3000)
          
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
        setErrorMsg("Please select at least one image file to upload.")
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
        "relative border-2 border-dashed rounded-2xl transition-all duration-300 bg-white shadow-lg shadow-gray-200/50 focus-within:ring-2 focus-within:ring-primary/30 focus-within:ring-offset-2 focus-within:ring-offset-white active:scale-[.99] dark:bg-gray-900 dark:border-gray-700 dark:shadow-black/20 dark:focus-within:ring-offset-gray-900",
        isDragOver
          ? "border-primary/30 bg-primary/10 shadow-xl shadow-primary/25 scale-[1.02] dark:border-primary/40"
          : "border-gray-300 hover:border-primary/60 hover:bg-white hover:shadow-xl hover:shadow-gray-200/60 dark:border-gray-700 dark:hover:border-primary/50 dark:hover:bg-gray-900",
        isUploading && "border-green-400 bg-green-50/80 shadow-lg shadow-green-200/50 dark:border-green-600 dark:bg-green-900/20 dark:shadow-green-900/20",
        pressed && "scale-[.99]",
        className,
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
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
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {isUploading 
              ? "Processing..." 
              : isDragOver 
                ? "Drop images here" 
                : "Upload Images"
            }
          </h3>

          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-md leading-relaxed">
            {isUploading 
              ? "Your images are being prepared for processing"
              : "Drag and drop your images here, or click to browse"
            }
          </p>
        </div>

        {/* 支持格式信息卡片 - 统一为中性/主色系 */}
        <div className="p-4 bg-white/70 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-900/60 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <p className="text-sm font-semibold">Supported formats</p>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">JPEG, PNG, WebP • Max 10MB per file</p>
        </div>

        {/* 持久反馈区域：成功与错误 */}
        {uploadSuccess && (
          <Alert className="mt-4 rounded-xl border border-green-200 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300" aria-live="polite">
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4" />
              <AlertDescription className="text-sm">Images uploaded successfully</AlertDescription>
            </div>
          </Alert>
        )}
        {errorMsg && (
          <Alert className="mt-4 rounded-xl border border-red-200 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300" aria-live="polite">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4" />
              <AlertDescription className="text-sm">{errorMsg}</AlertDescription>
            </div>
          </Alert>
        )}
      </div>
    </div>
  )
}
