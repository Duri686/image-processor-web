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
    const newImages = files.map((file, index) => ({
      file,
      id: `${file.name}-${file.size}-${Date.now()}-${index}`,
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
    <div className="space-y-4 md:space-y-6">
      {/* Upload area */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <ImageUploader onFilesSelected={handleFilesSelected} />
      </div>

      {/* Preview area */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">Images ({images.length})</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Preview and manage your uploaded images</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isProcessing && (
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="truncate">
                  Processing <span className="font-medium">{processingProgress.fileName}</span>...
                </div>
                <div className="text-center mt-0.5">
                  ({processingProgress.current}/{processingProgress.total})
                </div>
              </div>
            )}
            {images.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearAll} 
                className="h-10 rounded-lg shrink-0"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Clear All</span>
                <span className="sm:hidden">Clear</span>
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-3 md:gap-4 md:grid-cols-2 xl:grid-cols-3">
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
