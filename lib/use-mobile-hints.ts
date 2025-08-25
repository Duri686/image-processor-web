"use client"

import { useState, useCallback } from "react"
import { downloadImage } from "@/lib/image-processing"
import type { ImageFile } from "@/components/image-manager"

export function useMobileHints() {
  const [showGestureHint, setShowGestureHint] = useState(false)
  const [gestureHintMessage, setGestureHintMessage] = useState("")

  const showHint = useCallback((message: string, duration = 3000) => {
    setGestureHintMessage(message)
    setShowGestureHint(true)
    setTimeout(() => setShowGestureHint(false), duration)
  }, [])

  const hideHint = useCallback(() => {
    setShowGestureHint(false)
  }, [])

  return {
    showGestureHint,
    gestureHintMessage,
    showHint,
    hideHint,
  }
}

export function useMobileActions(
  images: ImageFile[],
  processedImages: ImageFile[],
  onCompress: (options: any) => Promise<void>,
  setActiveTab: (tab: string) => void,
  showHint: (message: string, duration?: number) => void
) {
  const handleMobileUpload = useCallback(() => {
    setActiveTab("upload")
    showHint("Tap or drag to upload images, long press for more options")
  }, [setActiveTab, showHint])

  const handleQuickCompress = useCallback(async () => {
    if (images.length === 0) return
    
    showHint("Quick compressing all images...")
    
    try {
      await onCompress({ preset: "balanced" })
      showHint("Compression completed!", 2000)
    } catch (error) {
      showHint("Compression failed, please try again", 2000)
    }
  }, [images, onCompress, showHint])

  const handleDownloadAll = useCallback(() => {
    if (processedImages.length === 0) return
    
    processedImages.forEach(image => {
      if (image.processedImage) {
        downloadImage(image.processedImage.blob, image.file.name)
      }
    })
    
    showHint(`Starting download of ${processedImages.length} images`, 2000)
  }, [processedImages, showHint])

  return {
    handleMobileUpload,
    handleQuickCompress,
    handleDownloadAll,
  }
}
