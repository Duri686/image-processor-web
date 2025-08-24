"use client"

import { useState, useCallback, useMemo } from "react"
import type React from "react"
import { Header } from "@/components/header"
import { ImageUploader } from "@/components/image-uploader"
import { ImagePreview } from "@/components/image-preview"
import { CompressionControls } from "@/components/compression-controls"
import { WebPConverter } from "@/components/webp-converter"
import { FormatConverter } from "@/components/format-converter"
import { FaviconGenerator } from "@/components/favicon-generator"
import { OGImageGenerator } from "@/components/og-image-generator"
import { DownloadManager } from "@/components/download-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { compressToTargetSize, compressBatch, type ProcessedImage, downloadImage, COMPRESSION_PRESETS } from "@/lib/image-processing"
import type { ExportItem } from "@/lib/download-manager"
import { Trash2, SlidersHorizontal, Wand2, DownloadCloud } from "lucide-react"

interface ImageFile {
  file: File
  id: string
  processedImage?: ProcessedImage
}

export default function HomePage() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [quality, setQuality] = useState(0.8)
  const [isProcessing, setIsProcessing] = useState(false)
  const [compressSub, setCompressSub] = useState<string>("compress-sub")
  const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0, fileName: "" })

  const handleFilesSelected = useCallback((files: File[]) => {
    const newImages = files.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
    }))
    setImages((prev) => [...prev, ...newImages])
  }, [])

  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }, [])

  const handleClearAll = useCallback(() => {
    setImages([])
  }, [])

  const handleCompress = useCallback(
    async (options: any) => {
      if (images.length === 0) return

      setIsProcessing(true)
      setProcessingProgress({ current: 0, total: images.length, fileName: "" })

      try {
        const files = images.map((img) => img.file)

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

          const updatedImages = images.map((img, index) => ({
            ...img,
            processedImage: results[index],
          }))
          setImages(updatedImages)
        } else if (options.targetSizeKB) {
          // Use target size compression
          const updatedImages = await Promise.all(
            images.map(async (img, index) => {
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

          const updatedImages = images.map((img, index) => ({
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
        const files = images.map((img) => img.file)
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
        const files = images.map((img) => img.file)
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

  const exportItems = useMemo((): ExportItem[] => {
    return images
      .filter((img) => img.processedImage)
      .map((img) => ({
        blob: img.processedImage!.blob,
        filename: `${img.file.name.split(".")[0]}_optimized.${img.processedImage!.blob.type.split("/")[1]}`,
        originalName: img.file.name,
        size: img.processedImage!.compressedSize,
        type: img.processedImage!.blob.type,
      }))
  }, [images])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* 功能区：始终可见，默认展示 Process */}
        <div className="max-w-5xl mx-auto w-full space-y-6">
          <Tabs defaultValue="compress" className="w-full" aria-label="Main operations">
            <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <TabsList
                className="w-full grid grid-cols-3 rounded-lg border bg-muted/60 p-1 text-sm"
                aria-label="Operation groups"
              >
                <TabsTrigger value="compress" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Process
                  {images.length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-[10px] leading-none">
                      {images.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="generate" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate
                </TabsTrigger>
                <TabsTrigger value="export" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <DownloadCloud className="w-4 h-4 mr-2" />
                  Export
                  {exportItems.length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-[10px] leading-none">
                      {exportItems.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="compress" className="mt-6 space-y-4">
              <Tabs value={compressSub} onValueChange={setCompressSub} className="w-full" aria-label="Processing options">
                {/* Mobile fallback: Select */}
                <div className="md:hidden">
                  <Select value={compressSub} onValueChange={setCompressSub}>
                    <SelectTrigger aria-label="Select processing option">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compress-sub">Compress</SelectItem>
                      <SelectItem value="webp-sub">WebP</SelectItem>
                      <SelectItem value="convert-sub">Convert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Desktop: scrollable Tabs */}
                <div className="hidden md:block">
                  <ScrollArea orientation="horizontal" className="w-full">
                    <TabsList
                      className="inline-flex min-w-full gap-1 rounded-lg border bg-muted/50 p-1 text-xs"
                      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                        const order = ["compress-sub", "webp-sub", "convert-sub"]
                        const idx = order.indexOf(compressSub)
                        if (e.key === "ArrowRight") {
                          setCompressSub(order[(idx + 1) % order.length])
                        } else if (e.key === "ArrowLeft") {
                          setCompressSub(order[(idx - 1 + order.length) % order.length])
                        }
                      }}
                    >
                      <TabsTrigger value="compress-sub" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        Compress
                      </TabsTrigger>
                      <TabsTrigger value="webp-sub" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        WebP
                      </TabsTrigger>
                      <TabsTrigger value="convert-sub" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        Convert
                      </TabsTrigger>
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>

                <TabsContent value="compress-sub" className="mt-4">
                  <CompressionControls
                    onCompress={handleCompress}
                    quality={quality}
                    onQualityChange={setQuality}
                    disabled={isProcessing}
                  />
                </TabsContent>

                <TabsContent value="webp-sub" className="mt-4">
                  <WebPConverter
                    onConvert={handleConvertWebP}
                    quality={quality}
                    onQualityChange={setQuality}
                    disabled={isProcessing}
                  />
                </TabsContent>

                <TabsContent value="convert-sub" className="mt-4">
                  <FormatConverter
                    onConvert={handleFormatConvert}
                    quality={quality}
                    onQualityChange={setQuality}
                    disabled={isProcessing}
                  />
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="generate" className="mt-6 space-y-4">
              <Tabs defaultValue="favicon-gen" className="w-full" aria-label="Generators">
                <TabsList className="grid w-full grid-cols-2 rounded-lg border bg-muted/50 p-1 text-xs">
                  <TabsTrigger value="favicon-gen" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Favicon</TabsTrigger>
                  <TabsTrigger value="og-gen" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">OG Image</TabsTrigger>
                </TabsList>

                <TabsContent value="favicon-gen" className="mt-4">
                  <FaviconGenerator selectedFiles={images.map((img) => img.file)} disabled={isProcessing} />
                </TabsContent>

                <TabsContent value="og-gen" className="mt-4">
                  <OGImageGenerator disabled={isProcessing} />
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="export" className="mt-6">
              <DownloadManager exportItems={exportItems} disabled={isProcessing} />
            </TabsContent>
          </Tabs>

          {/* Upload 区域：始终显示，方便随时添加图片 */}
          <ImageUploader onFilesSelected={handleFilesSelected} />
        </div>

        {/* 预览区：纵向布局置于下方 */}
        <div className="max-w-5xl mx-auto w-full space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold font-serif">Images ({images.length})</h3>
            <div className="flex items-center gap-2">
              {isProcessing && (
                <div className="text-sm text-muted-foreground">
                  Processing {processingProgress.fileName}... ({processingProgress.current}/{processingProgress.total})
                </div>
              )}
              {images.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleClearAll} className="bg-transparent">
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {images.map((image) => (
              <ImagePreview
                key={image.id}
                file={image.file}
                processedImage={image.processedImage}
                onRemove={() => handleRemoveImage(image.id)}
                onDownload={() => handleDownload(image)}
                className="h-full"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
