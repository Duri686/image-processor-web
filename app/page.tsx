"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ImageManager } from "@/components/image-manager"
import { ProcessingTabs } from "@/components/processing-tabs"
import { GenerationTabs } from "@/components/generation-tabs"
import { ExportTabs } from "@/components/export-tabs"
import { MobileActionBar, MobileGestureHint } from "@/components/mobile-action-bar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sliders, Wand2, DownloadCloud } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useImageProcessing } from "@/lib/use-image-processing"
import { useMobileHints, useMobileActions } from "@/lib/use-mobile-hints"
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

  // 移动端提示和手势
  const { showGestureHint, gestureHintMessage, showHint, hideHint } = useMobileHints()
  
  // 移动端操作
  const { handleMobileUpload, handleQuickCompress, handleDownloadAll } = useMobileActions(
    images,
    processedImages,
    handleCompress,
    setActiveTab,
    showHint
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] dark:from-[var(--gradient-from)] dark:via-[var(--gradient-via)] dark:to-[var(--gradient-to)]">
      <Header />

      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Main Operations Section */}
        <div className="max-w-5xl mx-auto w-full space-y-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <h2 className="text-base font-semibold text-gray-900">Main Operations</h2>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden">
            <Tabs defaultValue="compress" className="w-full" aria-label="Main operations">
              <div className="p-4 sm:p-6">
                <TabsList
                  className="w-full h-auto grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-2 rounded-2xl bg-white shadow-lg shadow-gray-200/50 p-4 sm:p-3 text-sm border border-gray-100"
                  aria-label="Operation groups"
                >
                  <TabsTrigger value="compress" className="flex items-center justify-start gap-3 h-16 sm:h-14 px-5 sm:px-4 rounded-xl font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 data-[state=active]:scale-[1.02] hover:bg-gray-50 hover:shadow-md text-gray-700 text-base sm:text-sm border border-transparent data-[state=active]:border-primary/20">
                    <div className="p-2.5 sm:p-2 rounded-lg bg-gray-100 data-[state=active]:bg-white/20 text-gray-600 data-[state=active]:text-white">
                      <Sliders className="w-5 h-5 sm:w-4 sm:h-4" />
                    </div>
                    <span className="font-semibold sm:font-medium">Process</span>
                    {images.length > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs sm:text-[10px] leading-none bg-gray-200 text-gray-700 data-[state=active]:bg-white/30 data-[state=active]:text-white border-0 px-2 py-1 sm:px-1.5 sm:py-0.5">
                        {images.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="generate" className="flex items-center justify-start gap-3 h-16 sm:h-14 px-5 sm:px-4 rounded-xl font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 data-[state=active]:scale-[1.02] hover:bg-gray-50 hover:shadow-md text-gray-700 text-base sm:text-sm border border-transparent data-[state=active]:border-primary/20">
                    <div className="p-2.5 sm:p-2 rounded-lg bg-gray-100 data-[state=active]:bg-white/20 text-gray-600 data-[state=active]:text-white">
                      <Wand2 className="w-5 h-5 sm:w-4 sm:h-4" />
                    </div>
                    <span className="font-semibold sm:font-medium">Generate</span>
                  </TabsTrigger>
                  <TabsTrigger value="export" className="flex items-center justify-start gap-3 h-16 sm:h-14 px-5 sm:px-4 rounded-xl font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 data-[state=active]:scale-[1.02] hover:bg-gray-50 hover:shadow-md text-gray-700 text-base sm:text-sm border border-transparent data-[state=active]:border-primary/20">
                    <div className="p-2.5 sm:p-2 rounded-lg bg-gray-100 data-[state=active]:bg-white/20 text-gray-600 data-[state=active]:text-white">
                      <DownloadCloud className="w-5 h-5 sm:w-4 sm:h-4" />
                    </div>
                    <span className="font-semibold sm:font-medium">Export</span>
                    {exportItems.length > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs sm:text-[10px] leading-none bg-gray-200 text-gray-700 data-[state=active]:bg-white/30 data-[state=active]:text-white border-0 px-2 py-1 sm:px-1.5 sm:py-0.5">
                        {exportItems.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="compress" className="px-4 sm:px-6 pb-4 sm:pb-6">
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

              <TabsContent value="generate" className="px-4 sm:px-6 pb-4 sm:pb-6">
                <GenerationTabs images={images} isProcessing={isProcessing} />
              </TabsContent>

              <TabsContent value="export" className="px-4 sm:px-6 pb-4 sm:pb-6">
                <ExportTabs exportItems={exportItems} isProcessing={isProcessing} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Image Management Section */}
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <h2 className="text-base font-semibold text-gray-900">Image Management</h2>
          </div>
        </div>
        <ImageManager
          images={images}
          onImagesChange={handleImagesChange}
          onDownloadImage={handleDownload}
          isProcessing={isProcessing}
          processingProgress={processingProgress}
        />
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
        onDismiss={hideHint}
      />
    </div>
  )
}
