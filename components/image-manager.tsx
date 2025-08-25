"use client"

import { useState, useCallback, useMemo } from "react"
import { ImageUploader } from "@/components/image-uploader"
import { ImagePreview } from "@/components/image-preview"
import { Button } from "@/components/ui/button"
import { Trash2, Image as ImageIcon } from "lucide-react"
import type { ProcessedImage } from "@/lib/image-processing"

export interface ImageFile {
  file: File
  id: string
  processedImage?: ProcessedImage
}

interface ImageManagerProps {
  images: ImageFile[]
  onImagesChange: (images: ImageFile[]) => void
  onDownloadImage: (image: ImageFile) => void
  isProcessing: boolean
  processingProgress: {
    current: number
    total: number
    fileName: string
  }
}

export function ImageManager({
  images,
  onImagesChange,
  onDownloadImage,
  isProcessing,
  processingProgress
}: ImageManagerProps) {
  const handleFilesSelected = useCallback((files: File[]) => {
    const newImages = files.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
    }))
    onImagesChange([...images, ...newImages])
  }, [images, onImagesChange])

  const handleRemoveImage = useCallback((id: string) => {
    onImagesChange(images.filter((img) => img.id !== id))
  }, [images, onImagesChange])

  const handleClearAll = useCallback(() => {
    onImagesChange([])
  }, [onImagesChange])

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6">
      {/* Upload area */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
        <ImageUploader onFilesSelected={handleFilesSelected} />
      </div>

      {/* Preview area */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <ImageIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-gray-900">Images ({images.length})</h3>
              <p className="text-sm text-gray-600">Preview and manage your uploaded images</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* 移动端优化：处理状态文字截断 */}
            <div className="min-w-0 flex-1 sm:flex-initial sm:max-w-xs">
              {isProcessing && (
                <div className="text-xs sm:text-sm text-muted-foreground bg-white/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg backdrop-blur-sm">
                  <div className="truncate">
                    Processing <span className="font-medium">{processingProgress.fileName}</span>...
                  </div>
                  <div className="text-center mt-0.5">
                    ({processingProgress.current}/{processingProgress.total})
                  </div>
                </div>
              )}
            </div>
            {images.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleClearAll} className="cursor-pointer bg-white/50 backdrop-blur-sm hover:bg-white/70 rounded-lg border-white/30 shrink-0">
                <Trash2 className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Clear All</span>
                <span className="sm:hidden">Clear</span>
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {images.map((image) => (
            <ImagePreview
              key={image.id}
              file={image.file}
              processedImage={image.processedImage}
              onRemove={() => handleRemoveImage(image.id)}
              onDownload={() => onDownloadImage(image)}
              className="h-full"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
