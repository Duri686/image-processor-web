"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { generateFavicon, downloadImage } from "@/lib/image-processing"
import { Star, Download, Info, Package, Loader2 } from "lucide-react"

interface FaviconGeneratorProps {
  selectedFiles: File[]
  disabled?: boolean
}

interface GeneratedFavicon {
  size: number
  blob: Blob
  dataUrl: string
}

const FAVICON_SIZES = [
  { size: 16, name: "16×16", description: "Browser tab, bookmarks" },
  { size: 32, name: "32×32", description: "Taskbar, desktop shortcuts" },
  { size: 48, name: "48×48", description: "Windows site icons" },
  { size: 64, name: "64×64", description: "High DPI displays" },
  { size: 96, name: "96×96", description: "Android home screen" },
  { size: 128, name: "128×128", description: "Chrome Web Store" },
  { size: 152, name: "152×152", description: "iPad home screen" },
  { size: 180, name: "180×180", description: "iPhone home screen" },
  { size: 192, name: "192×192", description: "Android Chrome" },
  { size: 512, name: "512×512", description: "PWA splash screen" },
]

export function FaviconGenerator({ selectedFiles, disabled = false }: FaviconGeneratorProps) {
  const [selectedSizes, setSelectedSizes] = useState<number[]>([16, 32, 48, 180, 192])
  const [generatedFavicons, setGeneratedFavicons] = useState<GeneratedFavicon[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleSizeToggle = useCallback((size: number, checked: boolean) => {
    setSelectedSizes((prev) => (checked ? [...prev, size] : prev.filter((s) => s !== size)))
  }, [])

  const handleSelectAllSizes = useCallback(() => {
    setSelectedSizes(FAVICON_SIZES.map((s) => s.size))
  }, [])

  const handleSelectCommonSizes = useCallback(() => {
    setSelectedSizes([16, 32, 48, 180, 192])
  }, [])

  const handleGenerateFavicons = useCallback(async () => {
    if (!selectedFile || selectedSizes.length === 0) return

    setIsGenerating(true)
    try {
      const favicons = await generateFavicon(selectedFile, selectedSizes)
      setGeneratedFavicons(favicons)
    } catch (error) {
      console.error("Error generating favicons:", error)
    } finally {
      setIsGenerating(false)
    }
  }, [selectedFile, selectedSizes])

  const handleDownloadFavicon = useCallback((favicon: GeneratedFavicon) => {
    const filename = `favicon-${favicon.size}x${favicon.size}.png`
    downloadImage(favicon.blob, filename)
  }, [])

  const handleDownloadAll = useCallback(() => {
    generatedFavicons.forEach((favicon) => {
      const filename = `favicon-${favicon.size}x${favicon.size}.png`
      downloadImage(favicon.blob, filename)
    })
  }, [generatedFavicons])

  // Auto-select first file if available
  useState(() => {
    if (selectedFiles.length > 0 && !selectedFile) {
      setSelectedFile(selectedFiles[0])
    }
  })

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">Favicon Generator</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Generate multiple favicon sizes for web and mobile platforms</p>
          </div>
        </div>
      </div>

      {/* File Selection */}
      {selectedFiles.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 space-y-3 md:space-y-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Source Image</h3>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg cursor-pointer transition-colors min-w-0 w-full ${
                selectedFile === file 
                  ? "bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary/40" 
                  : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
              }`}
              onClick={() => setSelectedFile(file)}
            >
              <div className="flex items-center gap-3 min-w-0 w-full">
                <Star className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100" title={file.name}>{file.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {(file.size / 1024).toFixed(1)} KB • {file.type}
                  </p>
                </div>
                {selectedFile === file && (
                  <Badge variant="outline" className="bg-primary/10 dark:bg-primary/20 text-primary border-primary/30 dark:border-primary/40 flex-shrink-0">
                    Selected
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Size Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 space-y-3 md:space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Favicon Sizes</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSelectCommonSizes} className="h-10 rounded-lg">
              Common
            </Button>
            <Button variant="outline" size="sm" onClick={handleSelectAllSizes} className="h-10 rounded-lg">
              All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FAVICON_SIZES.map((faviconSize) => (
            <div key={faviconSize.size} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600">
              <Checkbox
                id={`size-${faviconSize.size}`}
                checked={selectedSizes.includes(faviconSize.size)}
                onCheckedChange={(checked) => handleSizeToggle(faviconSize.size, checked as boolean)}
                disabled={disabled || isGenerating}
              />
              <div className="flex-1 min-w-0">
                <Label htmlFor={`size-${faviconSize.size}`} className="text-sm font-medium cursor-pointer text-gray-900 dark:text-gray-100">
                  {faviconSize.name}
                </Label>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{faviconSize.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <Button
          onClick={handleGenerateFavicons}
          disabled={disabled || isGenerating || !selectedFile || selectedSizes.length === 0}
          className="w-full h-12 rounded-lg font-medium"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Star className="w-5 h-5 mr-2" />
              Generate {selectedSizes.length} Favicons
            </>
          )}
        </Button>
      </div>

      {/* Generated Favicons Preview */}
      {generatedFavicons.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 space-y-3 md:space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Generated Favicons ({generatedFavicons.length})</h3>
            <Button variant="outline" size="sm" onClick={handleDownloadAll} className="h-10 rounded-lg">
              <Package className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {generatedFavicons.map((favicon) => (
              <div key={favicon.size} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 md:p-4 space-y-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600">
                <div className="aspect-square bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-500">
                  <img
                    src={favicon.dataUrl || "/placeholder.svg"}
                    alt={`${favicon.size}x${favicon.size} favicon`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center space-y-2">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {favicon.size}×{favicon.size}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{(favicon.blob.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadFavicon(favicon)}
                    className="w-full h-10 text-xs rounded-lg"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favicon Tips */}
      <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-800 dark:text-blue-300">
          <p className="font-medium mb-2">Favicon Best Practices:</p>
          <ul className="space-y-1 text-sm">
            <li>• Use simple, recognizable designs that work at small sizes</li>
            <li>• Include 16×16, 32×32, and 180×180 for basic browser support</li>
            <li>• Add 192×192 and 512×512 for PWA compatibility</li>
            <li>• Use high contrast colors and avoid fine details</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
