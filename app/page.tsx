"use client"

import { useState, useCallback, useMemo } from "react"
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
import { compressToTargetSize, compressBatch, type ProcessedImage, downloadImage } from "@/lib/image-processing"
import type { ExportItem } from "@/lib/download-manager"
import { Trash2 } from "lucide-react"

interface ImageFile {
  file: File
  id: string
  processedImage?: ProcessedImage
}

export default function HomePage() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [quality, setQuality] = useState(0.8)
  const [isProcessing, setIsProcessing] = useState(false)
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
          // Use preset compression
          const results = await compressBatch(files, { ...options }, (completed, total, fileName) => {
            setProcessingProgress({ current: completed, total, fileName })
          })

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
        {/* Upload Section */}
        {images.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-serif text-foreground mb-4">Professional Image Optimization</h2>
              <p className="text-muted-foreground">
                Compress, convert, and optimize your images directly in the browser. No uploads required - everything
                happens locally.
              </p>
            </div>

            <ImageUploader onFilesSelected={handleFilesSelected} />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Operations */}
            <div className="lg:col-span-1 space-y-6">
              <Tabs defaultValue="compress" className="w-full">
                <TabsList className="grid w-full grid-cols-3 text-xs">
                  <TabsTrigger value="compress">Process</TabsTrigger>
                  <TabsTrigger value="generate">Generate</TabsTrigger>
                  <TabsTrigger value="export">Export</TabsTrigger>
                </TabsList>

                <TabsContent value="compress" className="mt-6 space-y-4">
                  <Tabs defaultValue="compress-sub" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 text-xs">
                      <TabsTrigger value="compress-sub">Compress</TabsTrigger>
                      <TabsTrigger value="webp-sub">WebP</TabsTrigger>
                      <TabsTrigger value="convert-sub">Convert</TabsTrigger>
                    </TabsList>

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
                  <Tabs defaultValue="favicon-gen" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 text-xs">
                      <TabsTrigger value="favicon-gen">Favicon</TabsTrigger>
                      <TabsTrigger value="og-gen">OG Image</TabsTrigger>
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

              {/* Add more images */}
              <ImageUploader onFilesSelected={handleFilesSelected} className="h-32" />
            </div>

            {/* Right Column - Image Previews */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold font-serif">Images ({images.length})</h3>
                <div className="flex items-center gap-2">
                  {isProcessing && (
                    <div className="text-sm text-muted-foreground">
                      Processing {processingProgress.fileName}... ({processingProgress.current}/
                      {processingProgress.total})
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

              <div className="grid gap-4">
                {images.map((image) => (
                  <ImagePreview
                    key={image.id}
                    file={image.file}
                    processedImage={image.processedImage}
                    onRemove={() => handleRemoveImage(image.id)}
                    onDownload={() => handleDownload(image)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
