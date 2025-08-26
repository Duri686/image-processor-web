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
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center gap-3">
        <DownloadCloud className="w-5 h-5 text-primary" />
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">Export & Download</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Download your processed images individually or as a batch</p>
        </div>
      </div>
      <DownloadManager exportItems={exportItems} disabled={isProcessing} />
    </div>
  )
}
