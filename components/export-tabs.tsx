"use client"

import { DownloadManager } from "@/components/download-manager"
import { DownloadCloud } from "lucide-react"
import type { ExportItem } from "@/lib/download-manager"

interface ExportTabsProps {
  exportItems: ExportItem[]
  isProcessing: boolean
}

export function ExportTabs({ exportItems, isProcessing }: ExportTabsProps) {
  return (
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
  )
}
