"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
    <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8 border border-white/30 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
          <Star className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-serif text-foreground">Favicon Generator</h2>
          <p className="text-sm text-muted-foreground">Generate multiple favicon sizes for web and mobile platforms</p>
        </div>
      </div>

      {/* File Selection */}
      {selectedFiles.length > 0 && (
        <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/30 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <h3 className="text-lg font-semibold font-serif text-foreground">Source Image</h3>
          </div>
          <div className="space-y-3">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 min-w-0 w-full ${
                  selectedFile === file 
                    ? "bg-primary/10 hover:bg-primary/15 border border-primary/30 shadow-md" 
                    : "bg-white/50 hover:bg-white/70 border border-white/40"
                }`}
                onClick={() => setSelectedFile(file)}
              >
                <div className="flex items-center gap-3 min-w-0 w-full">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate text-foreground" title={file.name}>{file.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {(file.size / 1024).toFixed(1)} KB • {file.type}
                    </p>
                  </div>
                  {selectedFile === file && (
                    <Badge variant="default" className="bg-primary/20 text-primary border-primary/30 flex-shrink-0">
                      Selected
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <h3 className="text-lg font-semibold font-serif text-foreground">Favicon Sizes</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSelectCommonSizes} className="h-8 rounded-lg bg-white/50 hover:bg-white/70 border-white/40 text-xs">
              Common
            </Button>
            <Button variant="outline" size="sm" onClick={handleSelectAllSizes} className="h-8 rounded-lg bg-white/50 hover:bg-white/70 border-white/40 text-xs">
              All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FAVICON_SIZES.map((faviconSize) => (
            <div key={faviconSize.size} className="flex items-center space-x-3 p-3 rounded-lg bg-white/30 hover:bg-white/50 transition-colors">
              <Checkbox
                id={`size-${faviconSize.size}`}
                checked={selectedSizes.includes(faviconSize.size)}
                onCheckedChange={(checked) => handleSizeToggle(faviconSize.size, checked as boolean)}
                disabled={disabled || isGenerating}
                className="border-2 border-gray-400 bg-white/80 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <div className="flex-1 min-w-0">
                <Label htmlFor={`size-${faviconSize.size}`} className="text-sm font-medium cursor-pointer text-foreground">
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
        className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg transition-all duration-200"
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

      {/* Generated Favicons Preview */}
      {generatedFavicons.length > 0 && (
        <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <h3 className="text-lg font-semibold font-serif text-foreground">Generated Favicons ({generatedFavicons.length})</h3>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownloadAll} className="h-8 rounded-lg bg-white/50 hover:bg-white/70 border-white/40 text-xs">
              <Package className="w-3 h-3 mr-1" />
              Download All
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {generatedFavicons.map((favicon) => (
              <div key={favicon.size} className="bg-white/30 rounded-xl p-4 space-y-3 hover:bg-white/50 transition-colors">
                <div className="aspect-square bg-white/50 rounded-lg overflow-hidden border border-white/40 shadow-sm">
                  <img
                    src={favicon.dataUrl || "/placeholder.svg"}
                    alt={`${favicon.size}x${favicon.size} favicon`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center space-y-2">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {favicon.size}×{favicon.size}
                    </p>
                    <p className="text-xs text-muted-foreground">{(favicon.blob.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadFavicon(favicon)}
                    className="w-full h-8 text-xs rounded-lg bg-white/50 hover:bg-white/70 border-white/40"
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
      <div className="p-4 rounded-xl bg-blue-50/80 backdrop-blur-sm border border-blue-200/50">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Info className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800 space-y-2">
            <p className="font-semibold">Favicon Best Practices:</p>
            <ul className="space-y-1 text-blue-700">
              <li>• Use simple, recognizable designs that work at small sizes</li>
              <li>• Include 16×16, 32×32, and 180×180 for basic browser support</li>
              <li>• Add 192×192 and 512×512 for PWA compatibility</li>
              <li>• Use high contrast colors and avoid fine details</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
