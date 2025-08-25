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
import { MobileActionBar, MobileGestureHint } from "@/components/mobile-action-bar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Upload, 
  Download, 
  Trash2, 
  Settings, 
  Zap, 
  Target, 
  Sliders, 
  FileImage, 
  Wand2, 
  DownloadCloud, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  RotateCw, 
  FlipHorizontal, 
  FlipVertical, 
  Crop, 
  Palette,
  Image as ImageIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { compressToTargetSize, compressBatch, type ProcessedImage, downloadImage, COMPRESSION_PRESETS } from "@/lib/image-processing"
import type { ExportItem } from "@/lib/download-manager"

interface ImageFile {
  file: File
  id: string
  processedImage?: ProcessedImage
}

export default function HomePage() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [activeTab, setActiveTab] = useState("upload")
  const [compressSub, setCompressSub] = useState("compress-sub")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0, fileName: "" })
  const [showGestureHint, setShowGestureHint] = useState(false)
  const [gestureHintMessage, setGestureHintMessage] = useState("")
  const [quality, setQuality] = useState(0.8)

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

  const processedImages = useMemo(() => {
    return images.filter(img => img.processedImage)
  }, [images])

  const exportItems: ExportItem[] = useMemo(() => {
    return processedImages.map(img => ({
      id: img.id,
      name: img.file.name,
      blob: img.processedImage!.blob,
      originalSize: img.processedImage!.originalSize,
      compressedSize: img.processedImage!.compressedSize
    }))
  }, [processedImages])

  const handleMobileUpload = useCallback(() => {
    setActiveTab("upload")
    setShowGestureHint(true)
    setGestureHintMessage("Tap or drag to upload images, long press for more options")
    setTimeout(() => setShowGestureHint(false), 3000)
  }, [])

  const handleQuickCompress = useCallback(async () => {
    if (images.length === 0) return
    
    setShowGestureHint(true)
    setGestureHintMessage("Quick compressing all images...")
    
    try {
      await handleCompress({ preset: "balanced" })
      setGestureHintMessage("Compression completed!")
      setTimeout(() => setShowGestureHint(false), 2000)
    } catch (error) {
      setGestureHintMessage("Compression failed, please try again")
      setTimeout(() => setShowGestureHint(false), 2000)
    }
  }, [images, handleCompress])

  const handleDownloadAll = useCallback(() => {
    if (processedImages.length === 0) return
    
    processedImages.forEach(image => {
      if (image.processedImage) {
        downloadImage(image.processedImage.blob, image.file.name)
      }
    })
    
    setShowGestureHint(true)
    setGestureHintMessage(`Starting download of ${processedImages.length} images`)
    setTimeout(() => setShowGestureHint(false), 2000)
  }, [processedImages])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] dark:from-[var(--gradient-from)] dark:via-[var(--gradient-via)] dark:to-[var(--gradient-to)]">
      <Header />

      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Feature area: always visible, default shows Process */}
        <div className="max-w-5xl mx-auto w-full space-y-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden">
            <Tabs defaultValue="compress" className="w-full" aria-label="Main operations">
              <div className="p-4 sm:p-6">
                  <TabsList
                  className="w-full h-auto grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-2 rounded-2xl bg-white shadow-lg shadow-gray-200/50 p-4 sm:p-3 text-sm border border-gray-100"
                  aria-label="Operation groups"
                >
                <TabsTrigger value="compress" className="flex items-center justify-start gap-3 h-16 sm:h-14 px-5 sm:px-4 rounded-xl font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 data-[state=active]:scale-[1.02] hover:bg-gray-50 hover:shadow-md text-base sm:text-sm border border-transparent data-[state=active]:border-primary/20">
                  <div className="p-2.5 sm:p-2 rounded-lg bg-current/10 data-[state=active]:bg-white/20">
                    <Sliders className="w-5 h-5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="font-semibold sm:font-medium">Process</span>
                  {images.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs sm:text-[10px] leading-none bg-current/20 text-current border-0 px-2 py-1 sm:px-1.5 sm:py-0.5">
                      {images.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="generate" className="flex items-center justify-start gap-3 h-16 sm:h-14 px-5 sm:px-4 rounded-xl font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 data-[state=active]:scale-[1.02] hover:bg-gray-50 hover:shadow-md text-base sm:text-sm border border-transparent data-[state=active]:border-primary/20">
                  <div className="p-2.5 sm:p-2 rounded-lg bg-current/10 data-[state=active]:bg-white/20">
                    <Wand2 className="w-5 h-5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="font-semibold sm:font-medium">Generate</span>
                </TabsTrigger>
                <TabsTrigger value="export" className="flex items-center justify-start gap-3 h-16 sm:h-14 px-5 sm:px-4 rounded-xl font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 data-[state=active]:scale-[1.02] hover:bg-gray-50 hover:shadow-md text-base sm:text-sm border border-transparent data-[state=active]:border-primary/20">
                  <div className="p-2.5 sm:p-2 rounded-lg bg-current/10 data-[state=active]:bg-white/20">
                    <DownloadCloud className="w-5 h-5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="font-semibold sm:font-medium">Export</span>
                  {exportItems.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs sm:text-[10px] leading-none bg-current/20 text-current border-0 px-2 py-1 sm:px-1.5 sm:py-0.5">
                      {exportItems.length}
                    </Badge>
                  )}
                </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="compress" className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/30">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                      <Sliders className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold font-serif text-gray-900">Image Processing</h3>
                      <p className="text-sm sm:text-sm text-gray-600 mt-1">Choose your preferred compression method</p>
                    </div>
                  </div>

                  <Tabs value={compressSub} onValueChange={setCompressSub} className="w-full" aria-label="Processing options">
                  {/* Mobile fallback: Select */}
                  <div className="md:hidden">
                    <Select value={compressSub} onValueChange={setCompressSub}>
                      <SelectTrigger aria-label="Select processing option" className="h-14 rounded-xl bg-white/90 border-gray-300 text-base font-semibold text-gray-900 shadow-sm hover:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-white/40 bg-white/95 backdrop-blur-sm">
                        <SelectItem value="compress-sub" className="rounded-lg h-12 text-base">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="font-medium">Compress</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="webp-sub" className="rounded-lg h-12 text-base">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="font-medium">WebP</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="convert-sub" className="rounded-lg h-12 text-base">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span className="font-medium">Convert</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Desktop: scrollable Tabs */}
                  <div className="hidden md:block">
                    <ScrollArea orientation="horizontal" className="w-full">
                      <TabsList
                        className="inline-flex h-auto min-w-full gap-2 rounded-xl bg-white shadow-md shadow-gray-200/30 p-3 text-sm border border-gray-100 my-1 box-border"
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
                        <TabsTrigger value="compress-sub" className="flex items-center gap-2 h-11 px-4 rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 hover:bg-gray-50 hover:shadow-sm border border-transparent data-[state=active]:border-primary/20">
                          <div className="w-2.5 h-2.5 rounded-full bg-current/60 data-[state=active]:bg-white/80"></div>
                          <span>Compress</span>
                        </TabsTrigger>
                        <TabsTrigger value="webp-sub" className="flex items-center gap-2 h-11 px-4 rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 hover:bg-gray-50 hover:shadow-sm border border-transparent data-[state=active]:border-primary/20">
                          <div className="w-2.5 h-2.5 rounded-full bg-current/60 data-[state=active]:bg-white/80"></div>
                          <span>WebP</span>
                        </TabsTrigger>
                        <TabsTrigger value="convert-sub" className="flex items-center gap-2 h-11 px-4 rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 hover:bg-gray-50 hover:shadow-sm border border-transparent data-[state=active]:border-primary/20">
                          <div className="w-2.5 h-2.5 rounded-full bg-current/60 data-[state=active]:bg-white/80"></div>
                          <span>Convert</span>
                        </TabsTrigger>
                      </TabsList>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>

                  <TabsContent value="compress-sub" className="mt-4 sm:mt-6">
                    <CompressionControls
                      onCompress={handleCompress}
                      quality={quality}
                      onQualityChange={setQuality}
                      disabled={isProcessing || images.length === 0}
                    />
                  </TabsContent>

                  <TabsContent value="webp-sub" className="mt-4 sm:mt-6">
                    <WebPConverter
                      onConvert={handleConvertWebP}
                      quality={quality}
                      onQualityChange={setQuality}
                      disabled={isProcessing || images.length === 0}
                    />
                  </TabsContent>

                  <TabsContent value="convert-sub" className="mt-4 sm:mt-6">
                    <FormatConverter
                      onConvert={handleFormatConvert}
                      quality={quality}
                      onQualityChange={setQuality}
                      disabled={isProcessing || images.length === 0}
                    />
                  </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>

              <TabsContent value="generate" className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/30">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                      <Wand2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold font-serif text-gray-900">Image Generation</h3>
                      <p className="text-sm sm:text-sm text-gray-600 mt-1">Create favicons and social media images</p>
                    </div>
                  </div>

                  <Tabs defaultValue="favicon-gen" className="w-full" aria-label="Generators">
                  <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2 rounded-xl bg-white shadow-md shadow-gray-200/30 p-4 sm:p-3 text-sm border border-gray-100">
                    <TabsTrigger value="favicon-gen" className="flex items-center justify-start gap-3 h-14 sm:h-12 px-5 sm:px-4 rounded-xl font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 hover:bg-gray-50 hover:shadow-sm text-base sm:text-sm border border-transparent data-[state=active]:border-primary/20">
                      <div className="w-2.5 h-2.5 rounded-full bg-current/60 data-[state=active]:bg-white/80"></div>
                      <span className="font-semibold sm:font-medium">Favicon</span>
                    </TabsTrigger>
                    <TabsTrigger value="og-gen" className="flex items-center justify-start gap-3 h-14 sm:h-12 px-5 sm:px-4 rounded-xl font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 hover:bg-gray-50 hover:shadow-sm text-base sm:text-sm border border-transparent data-[state=active]:border-primary/20">
                      <div className="w-2.5 h-2.5 rounded-full bg-current/60 data-[state=active]:bg-white/80"></div>
                      <span className="font-semibold sm:font-medium">OG Image</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="favicon-gen" className="mt-4 sm:mt-6">
                    <FaviconGenerator selectedFiles={images.map((img) => img.file)} disabled={isProcessing} />
                  </TabsContent>

                  <TabsContent value="og-gen" className="mt-4 sm:mt-6">
                    <OGImageGenerator disabled={isProcessing} />
                  </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>

              <TabsContent value="export" className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/30">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                      <DownloadCloud className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold font-serif text-gray-900">Export & Download</h3>
                      <p className="text-sm sm:text-sm text-gray-600 mt-1">Download your processed images individually or as a batch</p>
                    </div>
                  </div>
                  <DownloadManager exportItems={exportItems} disabled={isProcessing} />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Upload area: always visible for easy image addition */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <ImageUploader onFilesSelected={handleFilesSelected} />
          </div>
        </div>

        {/* Preview area: vertical layout placed below */}
        <div className="max-w-5xl mx-auto w-full space-y-6">
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
                  onDownload={() => handleDownload(image)}
                  className="h-full"
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile action bar */}
      <MobileActionBar
        hasImages={images.length > 0}
        processedCount={processedImages.length}
        onUpload={handleMobileUpload}
        onDownloadAll={processedImages.length > 0 ? handleDownloadAll : undefined}
        onQuickCompress={images.length > 0 ? handleQuickCompress : undefined}
      />

      {/* Mobile gesture hints */}
      <MobileGestureHint
        show={showGestureHint}
        message={gestureHintMessage}
        onDismiss={() => setShowGestureHint(false)}
      />
    </div>
  )
}
