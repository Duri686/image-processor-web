"use client"

import { useState, useCallback } from "react"
import { compressToTargetSize, compressBatch, downloadImage, COMPRESSION_PRESETS } from "@/lib/image-processing"
import type { ImageFile } from "@/components/image-manager"

interface ProcessingProgress {
  current: number
  total: number
  fileName: string
}

export function useImageProcessing() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState<ProcessingProgress>({ 
    current: 0, 
    total: 0, 
    fileName: "" 
  })
  const [quality, setQuality] = useState(0.8)

  const handleImagesChange = useCallback((newImages: ImageFile[]) => {
    setImages(newImages)
  }, [])

  const handleCompress = useCallback(
    async (options: any) => {
      if (images.length === 0) return

      setIsProcessing(true)
      setProcessingProgress({ current: 0, total: images.length, fileName: "" })

      try {
        const files = images.map((img: ImageFile) => img.file)

        if (options.preset) {
          // Use preset compression (apply concrete options from COMPRESSION_PRESETS)
          const presetKey = options.preset as keyof typeof COMPRESSION_PRESETS
          const presetOptions = COMPRESSION_PRESETS[presetKey]
          const results = await compressBatch(
            files,
            {
              ...presetOptions,
            },
            (completed, total, fileName) => {
              setProcessingProgress({ current: completed, total, fileName })
            },
          )

          const updatedImages = images.map((img: ImageFile, index: number) => ({
            ...img,
            processedImage: results[index],
          }))
          setImages(updatedImages)
        } else if (options.targetSizeKB) {
          // Use target size compression
          const updatedImages = await Promise.all(
            images.map(async (img: ImageFile, index: number) => {
              setProcessingProgress({ current: index, total: images.length, fileName: img.file.name })
              const processed = await compressToTargetSize(img.file, options.targetSizeKB, {
                maxWidth: options.maxWidth,
                maxHeight: options.maxHeight,
                format: "jpeg",
              })
              return { ...img, processedImage: processed }
            }),
          )
          setImages(updatedImages)
        } else {
          // Use quality-based compression
          const results = await compressBatch(
            files,
            {
              quality: options.quality || quality,
              maxWidth: options.maxWidth,
              maxHeight: options.maxHeight,
              format: "jpeg",
            },
            (completed, total, fileName) => {
              setProcessingProgress({ current: completed, total, fileName })
            },
          )

          const updatedImages = images.map((img: ImageFile, index: number) => ({
            ...img,
            processedImage: results[index],
          }))
          setImages(updatedImages)
        }
      } catch (error) {
        console.error("Error processing images:", error)
      } finally {
        setIsProcessing(false)
        setProcessingProgress({ current: 0, total: 0, fileName: "" })
      }
    },
    [images, quality],
  )

  const handleConvertWebP = useCallback(
    async (options: { quality: number; lossless?: boolean }) => {
      if (images.length === 0) return

      setIsProcessing(true)
      setProcessingProgress({ current: 0, total: images.length, fileName: "" })

      try {
        const files = images.map((img: ImageFile) => img.file)
        const results = await compressBatch(
          files,
          {
            quality: options.quality,
            format: "webp",
          },
          (completed, total, fileName) => {
            setProcessingProgress({ current: completed, total, fileName })
          },
        )

        const updatedImages = images.map((img, index) => ({
          ...img,
          processedImage: results[index],
        }))
        setImages(updatedImages)
      } catch (error) {
        console.error("Error converting to WebP:", error)
      } finally {
        setIsProcessing(false)
        setProcessingProgress({ current: 0, total: 0, fileName: "" })
      }
    },
    [images],
  )

  const handleFormatConvert = useCallback(
    async (format: "jpeg" | "png" | "webp", conversionQuality: number) => {
      if (images.length === 0) return

      setIsProcessing(true)
      setProcessingProgress({ current: 0, total: images.length, fileName: "" })

      try {
        const files = images.map((img: ImageFile) => img.file)
        const results = await compressBatch(
          files,
          {
            quality: conversionQuality,
            format,
          },
          (completed, total, fileName) => {
            setProcessingProgress({ current: completed, total, fileName })
          },
        )

        const updatedImages = images.map((img, index) => ({
          ...img,
          processedImage: results[index],
        }))
        setImages(updatedImages)
      } catch (error) {
        console.error("Error converting format:", error)
      } finally {
        setIsProcessing(false)
        setProcessingProgress({ current: 0, total: 0, fileName: "" })
      }
    },
    [images],
  )

  const handleDownload = useCallback((image: ImageFile) => {
    if (!image.processedImage) return

    const extension = image.processedImage.blob.type.split("/")[1]
    const filename = `${image.file.name.split(".")[0]}_optimized.${extension}`
    downloadImage(image.processedImage.blob, filename)
  }, [])

  return {
    images,
    isProcessing,
    processingProgress,
    quality,
    setQuality,
    handleImagesChange,
    handleCompress,
    handleConvertWebP,
    handleFormatConvert,
    handleDownload,
  }
}
