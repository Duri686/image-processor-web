"use client"

import { useState } from "react"
import type React from "react"
import { CompressionControls } from "@/components/compression-controls"
import { WebPConverter } from "@/components/webp-converter"
import { FormatConverter } from "@/components/format-converter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Sliders } from "lucide-react"
import type { ImageFile } from "@/components/image-manager"

interface ProcessingTabsProps {
  images: ImageFile[]
  quality: number
  onQualityChange: (quality: number) => void
  onCompress: (options: any) => Promise<void>
  onConvertWebP: (options: { quality: number; lossless?: boolean }) => Promise<void>
  onFormatConvert: (format: "jpeg" | "png" | "webp", quality: number) => Promise<void>
  isProcessing: boolean
}

export function ProcessingTabs({
  images,
  quality,
  onQualityChange,
  onCompress,
  onConvertWebP,
  onFormatConvert,
  isProcessing
}: ProcessingTabsProps) {
  const [compressSub, setCompressSub] = useState("compress-sub")

  return (
    <div className="space-y-6">
      {/* 简化的标题区域 */}
      <div className="flex items-center gap-3">
        <Sliders className="w-5 h-5 text-primary" />
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Image Processing</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred compression method</p>
        </div>
      </div>

      <Tabs value={compressSub} onValueChange={setCompressSub} className="w-full" aria-label="Processing options">
        {/* 移动端选择器 */}
        <div className="md:hidden">
          <Select value={compressSub} onValueChange={setCompressSub}>
            <SelectTrigger className="h-12 rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-base font-medium text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent className="rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
              <SelectItem value="compress-sub">Compress</SelectItem>
              <SelectItem value="webp-sub">WebP</SelectItem>
              <SelectItem value="convert-sub">Convert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 桌面端标签页 */}
        <div className="hidden md:block">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <TabsTrigger 
              value="compress-sub" 
              className="rounded-md py-2 px-4 text-sm font-medium transition-all text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 data-[state=active]:shadow-sm"
            >
              Compress
            </TabsTrigger>
            <TabsTrigger 
              value="webp-sub" 
              className="rounded-md py-2 px-4 text-sm font-medium transition-all text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 data-[state=active]:shadow-sm"
            >
              WebP
            </TabsTrigger>
            <TabsTrigger 
              value="convert-sub" 
              className="rounded-md py-2 px-4 text-sm font-medium transition-all text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 data-[state=active]:shadow-sm"
            >
              Convert
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="compress-sub" className="mt-6">
          <CompressionControls
            onCompress={onCompress}
            quality={quality}
            onQualityChange={onQualityChange}
            disabled={isProcessing || images.length === 0}
          />
        </TabsContent>

        <TabsContent value="webp-sub" className="mt-6">
          <WebPConverter
            onConvert={onConvertWebP}
            quality={quality}
            onQualityChange={onQualityChange}
            disabled={isProcessing || images.length === 0}
          />
        </TabsContent>

        <TabsContent value="convert-sub" className="mt-6">
          <FormatConverter
            onConvert={onFormatConvert}
            quality={quality}
            onQualityChange={onQualityChange}
            disabled={isProcessing || images.length === 0}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
