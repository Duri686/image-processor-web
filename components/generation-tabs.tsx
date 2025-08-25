"use client"

import { FaviconGenerator } from "@/components/favicon-generator"
import { OGImageGenerator } from "@/components/og-image-generator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wand2 } from "lucide-react"
import type { ImageFile } from "@/components/image-manager"

interface GenerationTabsProps {
  images: ImageFile[]
  isProcessing: boolean
}

export function GenerationTabs({ images, isProcessing }: GenerationTabsProps) {
  return (
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
          <TabsTrigger value="favicon-gen" className="flex items-center justify-start gap-3 h-14 sm:h-12 px-5 sm:px-4 rounded-xl font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 hover:bg-gray-50 hover:shadow-sm text-gray-700 text-base sm:text-sm border border-transparent data-[state=active]:border-primary/20">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-400 data-[state=active]:bg-white/80"></div>
            <span className="font-semibold sm:font-medium">Favicon</span>
          </TabsTrigger>
          <TabsTrigger value="og-gen" className="flex items-center justify-start gap-3 h-14 sm:h-12 px-5 sm:px-4 rounded-xl font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 hover:bg-gray-50 hover:shadow-sm text-gray-700 text-base sm:text-sm border border-transparent data-[state=active]:border-primary/20">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-400 data-[state=active]:bg-white/80"></div>
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
  )
}
