"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
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

  const handleExport = useCallback(async () => {
    if (exportItems.length === 0) return

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
  }, [exportItems, selectedPattern, customPattern, onExportComplete])

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

  const previewFilename =
    exportItems.length > 0
      ? generateFilename(
          exportItems[0].originalName || exportItems[0].filename,
          selectedPattern === "custom" ? customPattern : selectedPattern,
          exportItems[0].type.split("/")[1],
        )
      : ""

  if (exportItems.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No processed images to export</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold font-serif">Export Manager</h2>
        </div>
        <Badge variant="outline" className="px-2 py-0.5 text-[12px]">
          {formatExportSummary(exportItems)}
        </Badge>
      </div>

      {/* Export Items List */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Files to Export ({exportItems.length})</Label>
        <div className="max-h-32 overflow-y-auto space-y-2">
          {exportItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.filename}</p>
                <p className="text-xs text-muted-foreground">
                  {(item.size / 1024).toFixed(1)} KB • {item.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Naming Pattern */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">File Naming Pattern</Label>
        <Select value={selectedPattern} onValueChange={setSelectedPattern}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NAMING_PATTERNS.map((pattern) => (
              <SelectItem key={pattern.value} value={pattern.value}>
                {pattern.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedPattern === "custom" && (
          <div className="space-y-2">
            <Input
              value={customPattern}
              onChange={(e) => setCustomPattern(e.target.value)}
              placeholder="e.g., {name}_compressed.{ext}"
              disabled={disabled || isExporting}
            />
            <p className="text-xs text-muted-foreground">
              Use {"{name}"} for original name, {"{ext}"} for extension, {"{timestamp}"} for timestamp, {"{date}"} for
              date
            </p>
          </div>
        )}

        {previewFilename && (
          <div className="p-2 rounded-lg border bg-muted/60">
            <p className="text-xs text-muted-foreground">Preview</p>
            <p className="text-sm font-mono">{previewFilename}</p>
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Export Options</Label>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="include-originals"
            checked={includeOriginals}
            onCheckedChange={(checked) => setIncludeOriginals(checked as boolean)}
            disabled={disabled || isExporting}
          />
          <Label htmlFor="include-originals" className="text-sm cursor-pointer">
            Include original files
          </Label>
        </div>
      </div>

      {/* Progress moved to toast notifications */}

      {/* Export Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleDownloadAll}
          disabled={disabled || isExporting || exportItems.length === 0}
          variant="outline"
          className="bg-transparent"
        >
          <Download className="w-4 h-4 mr-2" />
          Quick Download
        </Button>

        <Button
          onClick={handleExport}
          disabled={disabled || isExporting || exportItems.length === 0}
          className="bg-primary"
        >
          <Package className="w-4 h-4 mr-2" />
          {isExporting ? "Exporting..." : "Export All"}
        </Button>
      </div>

      {/* Export Tips */}
      <Alert>
        <Info className="h-4 w-4 text-muted-foreground" />
        <AlertDescription>
          <div className="space-y-1">
            <p className="font-medium text-foreground">Export Tips</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Files download individually to avoid browser limits</li>
              <li>• Use custom patterns for consistent naming</li>
              <li>• Check your browser's download folder</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    </Card>
  )
}
