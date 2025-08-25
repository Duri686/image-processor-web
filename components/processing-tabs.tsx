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
              <TabsTrigger value="compress-sub" className="flex items-center gap-2 h-11 px-4 rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 hover:bg-gray-50 hover:shadow-sm text-gray-700 border border-transparent data-[state=active]:border-primary/20">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400 data-[state=active]:bg-white/80"></div>
                <span>Compress</span>
              </TabsTrigger>
              <TabsTrigger value="webp-sub" className="flex items-center gap-2 h-11 px-4 rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 hover:bg-gray-50 hover:shadow-sm text-gray-700 border border-transparent data-[state=active]:border-primary/20">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400 data-[state=active]:bg-white/80"></div>
                <span>WebP</span>
              </TabsTrigger>
              <TabsTrigger value="convert-sub" className="flex items-center gap-2 h-11 px-4 rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 hover:bg-gray-50 hover:shadow-sm text-gray-700 border border-transparent data-[state=active]:border-primary/20">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400 data-[state=active]:bg-white/80"></div>
                <span>Convert</span>
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <TabsContent value="compress-sub" className="mt-4 sm:mt-6">
          <CompressionControls
            onCompress={onCompress}
            quality={quality}
            onQualityChange={onQualityChange}
            disabled={isProcessing || images.length === 0}
          />
        </TabsContent>

        <TabsContent value="webp-sub" className="mt-4 sm:mt-6">
          <WebPConverter
            onConvert={onConvertWebP}
            quality={quality}
            onQualityChange={onQualityChange}
            disabled={isProcessing || images.length === 0}
          />
        </TabsContent>

        <TabsContent value="convert-sub" className="mt-4 sm:mt-6">
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
