"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { generateFavicon, downloadImage } from "@/lib/image-processing"
import { Star, Download, Info, Package } from "lucide-react"

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
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold font-serif">Favicon Generator</h2>
      </div>

      {/* File Selection */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Source Image</Label>
          <div className="grid gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedFile === file ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedFile(file)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB • {file.type}
                    </p>
                  </div>
                  {selectedFile === file && <Badge variant="default">Selected</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Favicon Sizes</Label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSelectCommonSizes} className="bg-transparent">
              Common
            </Button>
            <Button variant="outline" size="sm" onClick={handleSelectAllSizes} className="bg-transparent">
              All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {FAVICON_SIZES.map((faviconSize) => (
            <div key={faviconSize.size} className="flex items-center space-x-3">
              <Checkbox
                id={`size-${faviconSize.size}`}
                checked={selectedSizes.includes(faviconSize.size)}
                onCheckedChange={(checked) => handleSizeToggle(faviconSize.size, checked as boolean)}
                disabled={disabled || isGenerating}
              />
              <div className="flex-1 min-w-0">
                <Label htmlFor={`size-${faviconSize.size}`} className="text-sm font-medium cursor-pointer">
                  {faviconSize.name}
                </Label>
                <p className="text-xs text-muted-foreground truncate">{faviconSize.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerateFavicons}
        disabled={disabled || isGenerating || !selectedFile || selectedSizes.length === 0}
        className="w-full"
        size="lg"
      >
        <Star className="w-4 h-4 mr-2" />
        {isGenerating ? "Generating..." : `Generate ${selectedSizes.length} Favicons`}
      </Button>

      {/* Generated Favicons Preview */}
      {generatedFavicons.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Generated Favicons ({generatedFavicons.length})</Label>
            <Button variant="outline" size="sm" onClick={handleDownloadAll} className="bg-transparent">
              <Package className="w-3 h-3 mr-1" />
              Download All
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {generatedFavicons.map((favicon) => (
              <div key={favicon.size} className="space-y-2">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden border">
                  <img
                    src={favicon.dataUrl || "/placeholder.svg"}
                    alt={`${favicon.size}x${favicon.size} favicon`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs font-medium">
                    {favicon.size}×{favicon.size}
                  </p>
                  <p className="text-xs text-muted-foreground">{(favicon.blob.size / 1024).toFixed(1)} KB</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadFavicon(favicon)}
                    className="w-full h-7 text-xs bg-transparent"
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
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">Favicon Best Practices:</p>
            <ul className="text-sm space-y-1">
              <li>• Use simple, recognizable designs that work at small sizes</li>
              <li>• Include 16×16, 32×32, and 180×180 for basic browser support</li>
              <li>• Add 192×192 and 512×512 for PWA compatibility</li>
              <li>• Use high contrast colors and avoid fine details</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    </Card>
  )
}
