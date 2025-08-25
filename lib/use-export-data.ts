"use client"

import { useMemo } from "react"
import type { ImageFile } from "@/components/image-manager"
import type { ExportItem } from "@/lib/download-manager"

export function useExportData(images: ImageFile[]) {
  const processedImages = useMemo(() => {
    return images.filter((img: ImageFile) => img.processedImage)
  }, [images])

  const exportItems: ExportItem[] = useMemo(() => {
    return processedImages.map(img => ({
      blob: img.processedImage!.blob,
      filename: img.file.name,
      originalName: img.file.name,
      size: img.processedImage!.compressedSize || img.processedImage!.blob.size || 0,
      type: img.file.type || 'image/png',
      originalBlob: img.file,
      originalSize: img.processedImage!.originalSize || img.file.size || 0,
      originalType: img.file.type
    }))
  }, [processedImages])

  return {
    processedImages,
    exportItems,
  }
}
