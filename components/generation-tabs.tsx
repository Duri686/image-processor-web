"use client"

import { useState } from "react"
import { FaviconGenerator } from "@/components/favicon-generator"
import { OGImageGenerator } from "@/components/og-image-generator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Wand2 } from "lucide-react"
import type { ImageFile } from "@/components/image-manager"

interface GenerationTabsProps {
  images: ImageFile[]
  isProcessing: boolean
}

export function GenerationTabs({ images, isProcessing }: GenerationTabsProps) {
  const [selectedTab, setSelectedTab] = useState("favicon-gen")

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <div className="flex items-center gap-3">
          <Wand2 className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">Image Generation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Create favicons and social media images</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        {/* Mobile Select */}
        <div className="md:hidden space-y-3">
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Generator Type</Label>
          <Select value={selectedTab} onValueChange={setSelectedTab}>
            <SelectTrigger className="h-12 rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-lg bg-white dark:bg-gray-700 shadow-lg">
              <SelectItem value="favicon-gen">Favicon Generator</SelectItem>
              <SelectItem value="og-gen">OG Image Generator</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full hidden md:block">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <TabsTrigger 
              value="favicon-gen" 
              className="rounded-md py-2 px-4 text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 data-[state=active]:shadow-sm"
            >
              Favicon Generator
            </TabsTrigger>
            <TabsTrigger 
              value="og-gen" 
              className="rounded-md py-2 px-4 text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 data-[state=active]:shadow-sm"
            >
              OG Image Generator
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      {selectedTab === "favicon-gen" && (
        <FaviconGenerator selectedFiles={images.map((img) => img.file)} disabled={isProcessing} />
      )}
      {selectedTab === "og-gen" && (
        <OGImageGenerator disabled={isProcessing} />
      )}
    </div>
  )
}
