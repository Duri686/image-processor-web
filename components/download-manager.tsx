"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { downloadMultipleFiles, generateFilename, formatExportSummary, createZip, type ExportItem } from "@/lib/download-manager"
import { Download, Package, Info } from "lucide-react"
import { toast } from "sonner"

interface DownloadManagerProps {
  exportItems: ExportItem[]
  disabled?: boolean
  onExportComplete?: () => void
}

const NAMING_PATTERNS = [
  { label: "Original name + suffix", value: "{name}_optimized.{ext}" },
  { label: "Original name + timestamp", value: "{name}_{timestamp}.{ext}" },
  { label: "Original name + date", value: "{name}_{date}.{ext}" },
  { label: "Optimized + original name", value: "optimized_{name}.{ext}" },
  { label: "Custom pattern", value: "custom" },
]

export function DownloadManager({ exportItems, disabled = false, onExportComplete }: DownloadManagerProps) {
  const [selectedPattern, setSelectedPattern] = useState("{name}_optimized.{ext}")
  const [customPattern, setCustomPattern] = useState("")
  const [includeOriginals, setIncludeOriginals] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [customPatternError, setCustomPatternError] = useState("")

  // Validate custom pattern
  const validateCustomPattern = useCallback((pattern: string) => {
    if (!pattern.trim()) {
      return "Custom pattern cannot be empty"
    }
    if (!pattern.includes("{name}") && !pattern.includes("{ext}")) {
      return "Pattern must include at least {name} or {ext}"
    }
    if (!pattern.includes("{ext}")) {
      return "Pattern must include {ext} for file extension"
    }
    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*]/
    if (invalidChars.test(pattern.replace(/\{[^}]+\}/g, ""))) {
      return "Pattern contains invalid filename characters"
    }
    return ""
  }, [])

  const handleExport = useCallback(async () => {
    if (exportItems.length === 0) return

    // Validate custom pattern if selected
    if (selectedPattern === "custom") {
      const error = validateCustomPattern(customPattern)
      if (error) {
        setCustomPatternError(error)
        toast.error("Invalid naming pattern", { description: error })
        return
      }
      setCustomPatternError("")
    }

    setIsExporting(true)
    // Use toast to show progress
    const toastId = Math.random().toString(36).slice(2)
    toast.loading("Creating ZIP...", { id: toastId, description: "0%", duration: Infinity })

    try {
      const pattern = selectedPattern === "custom" ? customPattern : selectedPattern

      // Prepare filenames inside ZIP using current naming pattern
      const filesForZip = exportItems.map((item) => ({
        ...item,
        filename: generateFilename(
          item.originalName || item.filename,
          pattern,
          item.type.split("/")[1],
        ),
      }))

      const zipBlob = await createZip(
        filesForZip,
        { includeOriginals, createSubfolders: false, namePattern: pattern },
        (percent: number) => {
          const p = Math.max(0, Math.min(100, Math.round(percent)))
          toast("Creating ZIP...", { id: toastId, description: `${p}%`, duration: Infinity })
        },
      )

      // Trigger single ZIP download
      const zipName = `images-${new Date().toISOString().replace(/[:T]/g, "-").split(".")[0]}.zip`
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = zipName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success("Export complete", { id: toastId, description: zipName })
      onExportComplete?.()
    } catch (error) {
      console.error("Export failed:", error)
      toast.error("Export failed")
    } finally {
      setIsExporting(false)
    }
  }, [exportItems, selectedPattern, customPattern, onExportComplete, validateCustomPattern])

  const handleDownloadAll = useCallback(() => {
    exportItems.forEach((item, index) => {
      setTimeout(() => {
        const url = URL.createObjectURL(item.blob)
        const a = document.createElement("a")
        a.href = url
        a.download = item.filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, index * 100) // Stagger downloads
    })
  }, [exportItems])

  // Handle custom pattern changes
  const handleCustomPatternChange = useCallback((value: string) => {
    setCustomPattern(value)
    if (value.trim()) {
      const error = validateCustomPattern(value)
      setCustomPatternError(error)
    } else {
      setCustomPatternError("Custom pattern cannot be empty")
    }
  }, [validateCustomPattern])

  const previewFilename =
    exportItems.length > 0 && (selectedPattern !== "custom" || (customPattern.trim() && !customPatternError))
      ? generateFilename(
          exportItems[0].originalName || exportItems[0].filename,
          selectedPattern === "custom" ? customPattern : selectedPattern,
          exportItems[0].type?.split("/")[1] || "jpg",
        )
      : ""

  // Check if export should be disabled
  const isExportDisabled = disabled || isExporting || exportItems.length === 0 || 
    (selectedPattern === "custom" && (!customPattern.trim() || customPatternError))

  if (exportItems.length === 0) {
    return (
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
        <Package className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No images to export</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">After processing images, you can batch download or export them here</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <Download className="w-5 h-5 text-primary" />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">Export Manager</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Batch download and package your processed results</p>
          </div>
        </div>
        <Badge variant="outline" className="px-3 py-1.5 text-sm font-medium bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 shrink-0">
          {formatExportSummary(exportItems)}
        </Badge>
      </div>

      {/* Export Items List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <Label className="text-base font-semibold text-gray-900 dark:text-gray-100">Files to Export ({exportItems.length})</Label>
        </div>
        <div className="max-h-40 overflow-y-auto space-y-2">
          {exportItems.map((item, index) => (
            <div key={`${item.filename}-${item.size || 0}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.filename}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {typeof item.size === 'number' && !isNaN(item.size) ? (item.size / 1024).toFixed(1) : '0.0'} KB • {item.type?.split('/')[1]?.toUpperCase() || 'FILE'}
                </p>
              </div>
              <div className="ml-3 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-md">
                Processed
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Naming Pattern */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <Label className="text-base font-semibold text-gray-900 dark:text-gray-100">File Naming Pattern</Label>
        </div>
        <Select value={selectedPattern} onValueChange={setSelectedPattern}>
          <SelectTrigger className="h-10 rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-base font-medium text-gray-900 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20">
            <SelectValue className="text-gray-900 dark:text-gray-100" />
          </SelectTrigger>
          <SelectContent className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg">
            {NAMING_PATTERNS.map((pattern) => (
              <SelectItem key={pattern.value} value={pattern.value} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="py-1">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{pattern.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedPattern === "custom" && (
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Custom Naming Pattern</Label>
            <Input
              value={customPattern}
              onChange={(e) => handleCustomPatternChange(e.target.value)}
              placeholder="e.g., {name}_compressed.{ext}"
              disabled={disabled || isExporting}
              className={`h-10 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 shadow-sm focus:ring-2 transition-all ${
                customPatternError 
                  ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-800" 
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary/20"
              }`}
            />
            {customPatternError && (
              <div className="flex items-start gap-2 text-xs text-red-700 dark:text-red-400">
                <span className="text-red-600 dark:text-red-400 font-bold">!</span>
                <span>{customPatternError}</span>
              </div>
            )}
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p className="font-medium mb-1">Available variables:</p>
              <div className="grid grid-cols-2 gap-1">
                <div><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{"{"}name{"}"}</code> Original filename</div>
                <div><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{"{"}ext{"}"}</code> File extension</div>
                <div><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{"{"}timestamp{"}"}</code> Timestamp</div>
                <div><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{"{"}date{"}"}</code> Date</div>
              </div>
            </div>
          </div>
        )}

        {previewFilename && (
          <div className="text-xs">
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
              {selectedPattern === "custom" && customPattern.trim() && !customPatternError ? "✓ " : ""}Filename Preview
            </p>
            <p className="text-sm font-mono text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">{previewFilename}</p>
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <Label className="text-base font-semibold text-gray-900 dark:text-gray-100">Export Options</Label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="include-originals"
            checked={includeOriginals}
            onCheckedChange={(checked) => setIncludeOriginals(checked as boolean)}
            disabled={disabled || isExporting}
            className="w-5 h-5"
          />
          <div className="flex-1">
            <Label htmlFor="include-originals" className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
              Include original files
            </Label>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Include unprocessed original image files in the export package</p>
          </div>
        </div>
      </div>

      {/* Progress moved to toast notifications */}

      {/* Export Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={handleDownloadAll}
          disabled={isExportDisabled}
          variant="outline"
          className="h-10 rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4 mr-2" />
          Quick Download
        </Button>

        <Button
          onClick={handleExport}
          disabled={isExportDisabled}
          className="h-10 rounded-lg bg-primary text-primary-foreground font-medium shadow-md hover:bg-primary/90 transition-all focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Package className="w-4 h-4 mr-2" />
          {isExporting ? "Exporting..." : "Export All"}
        </Button>
      </div>

      {/* Export Tips */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
        <div className="flex gap-3">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <p className="font-semibold text-gray-900 dark:text-gray-100">Export Tips</p>
            <ul className="text-sm space-y-1.5 text-gray-700 dark:text-gray-300">
              <li><strong>Quick Download:</strong> Files download individually to avoid browser limits</li>
              <li><strong>Export All:</strong> All files packaged into ZIP file for easy management</li>
              <li><strong>Naming Pattern:</strong> Use custom patterns for consistent filename formatting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
