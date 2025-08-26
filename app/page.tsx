"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ImageManager } from "@/components/image-manager"
import { ProcessingTabs } from "@/components/processing-tabs"
import { GenerationTabs } from "@/components/generation-tabs"
import { ExportTabs } from "@/components/export-tabs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sliders, Wand2, DownloadCloud } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useImageProcessing } from "@/lib/use-image-processing"
import { useExportData } from "@/lib/use-export-data"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("upload")
  
  // 图片处理相关状态和逻辑
  const {
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
  } = useImageProcessing()

  // 导出数据计算
  const { processedImages, exportItems } = useExportData(images)


  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] dark:from-[var(--gradient-from)] dark:via-[var(--gradient-via)] dark:to-[var(--gradient-to)]">
      <Header />

      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Main Operations Section */}
        <div className="max-w-5xl mx-auto w-full space-y-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Main Operations</h2>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
            <Tabs defaultValue="compress" className="w-full" aria-label="Main operations">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <TabsTrigger
                  value="compress"
                  className="flex items-center justify-start sm:justify-center gap-2 h-12 rounded-lg font-medium text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 data-[state=active]:shadow-sm touch-manipulation cursor-pointer select-none px-3"
                >
                  <Sliders className="w-4 h-4 pointer-events-none" />
                  <span className="pointer-events-none">Process</span>
                  {images.length > 0 && (
                    <Badge variant="secondary" className="ml-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-500 pointer-events-none">
                      {images.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="generate"
                  className="flex items-center justify-start sm:justify-center gap-2 h-12 rounded-lg font-medium text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 data-[state=active]:shadow-sm touch-manipulation cursor-pointer select-none px-3"
                >
                  <Wand2 className="w-4 h-4 pointer-events-none" />
                  <span className="pointer-events-none">Generate</span>
                </TabsTrigger>
                <TabsTrigger
                  value="export"
                  className="flex items-center justify-start sm:justify-center gap-2 h-12 rounded-lg font-medium text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 data-[state=active]:shadow-sm touch-manipulation cursor-pointer select-none px-3"
                >
                  <DownloadCloud className="w-4 h-4 pointer-events-none" />
                  <span className="pointer-events-none">Export</span>
                  {exportItems.length > 0 && (
                    <Badge variant="secondary" className="ml-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-500 pointer-events-none">
                      {exportItems.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="compress" className="mt-4 md:mt-6">
                <ProcessingTabs
                  images={images}
                  quality={quality}
                  onQualityChange={setQuality}
                  onCompress={handleCompress}
                  onConvertWebP={handleConvertWebP}
                  onFormatConvert={handleFormatConvert}
                  isProcessing={isProcessing}
                />
              </TabsContent>

              <TabsContent value="generate" className="mt-4 md:mt-6">
                <GenerationTabs images={images} isProcessing={isProcessing} />
              </TabsContent>

              <TabsContent value="export" className="mt-4 md:mt-6">
                <ExportTabs exportItems={exportItems} isProcessing={isProcessing} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Image Management Section */}
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Image Management</h2>
          </div>
          <ImageManager
          images={images}
          onImagesChange={handleImagesChange}
          onDownloadImage={handleDownload}
          isProcessing={isProcessing}
          processingProgress={processingProgress}
        />
        </div>

      </main>

    </div>
  )
}
