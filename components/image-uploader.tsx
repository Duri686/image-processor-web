"use client"

import type React from "react"
import { useCallback, useState } from "react"
import { UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
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

  const handleFileProcessing = useCallback((files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))
    const rejectedFiles = files.filter((file) => !file.type.startsWith("image/"))

    if (rejectedFiles.length > 0) {
      toast.error("Invalid file type", {
        description: `${rejectedFiles.length} file(s) were rejected. Only image files are supported.`,
        duration: 4000,
      })
    }

    if (imageFiles.length > 0) {
      setIsUploading(true)
      setTimeout(() => {
        onFilesSelected(imageFiles)
        setIsUploading(false)
        toast.success("Images added successfully", {
          description: `${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} ready for processing`,
          duration: 3000,
        })
      }, 500)
    } else if (rejectedFiles.length === 0) {
      toast.error("No files selected", {
        description: "Please select at least one image file.",
        duration: 3000,
      })
    }
  }, [onFilesSelected])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    handleFileProcessing(files)
  }, [handleFileProcessing])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFileProcessing(files)
    e.target.value = ""
  }, [handleFileProcessing])

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div
        className={cn(
          "relative flex min-h-[200px] w-full items-center justify-center rounded-lg border-2 border-dashed transition-colors",
          isDragOver
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 bg-gray-50",
          "hover:border-blue-400 hover:bg-blue-50"
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
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-wait"
        />
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <UploadCloud className="h-8 w-8 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isUploading ? "Processing..." : "Upload Images"}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {isUploading
              ? "Your images are being prepared..."
              : "Drag and drop your images here"}
          </p>
          {!isUploading && (
            <Button variant="outline" className="h-10 rounded-lg">
              Browse Files
            </Button>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3 text-center">
        Supported formats: JPEG, PNG, WebP, AVIF • Max 10MB per file
      </p>
    </div>
  )
}
