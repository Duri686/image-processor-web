"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Upload, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploaderProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  multiple?: boolean
  className?: string
}

export function ImageUploader({ onFilesSelected, accept = "image/*", multiple = true, className }: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)

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

      const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))

      if (files.length > 0) {
        onFilesSelected(files)
      }
    },
    [onFilesSelected],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length > 0) {
        onFilesSelected(files)
      }
    },
    [onFilesSelected],
  )

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg transition-colors duration-200",
        isDragOver ? "border-primary bg-accent/50" : "border-border bg-card hover:border-primary/50",
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
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-4 p-4 rounded-full bg-accent">
          {isDragOver ? (
            <Upload className="w-8 h-8 text-primary" />
          ) : (
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          )}
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2">
          {isDragOver ? "Drop images here" : "Upload images"}
        </h3>

        <p className="text-sm text-muted-foreground mb-4">Drag and drop your images here, or click to browse</p>

        <p className="text-xs text-muted-foreground">Supports JPEG, PNG, WebP formats</p>
      </div>
    </div>
  )
}
