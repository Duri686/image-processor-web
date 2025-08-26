import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"

interface OGPreviewProps {
  generatedImage: { blob: Blob; dataUrl: string } | null
  titleContrastInfo: {
    badgeClass: string
    friendly: string
    tooltip: string
  }
  subtitleContrastInfo: {
    badgeClass: string
    friendly: string
    tooltip: string
  }
  onDownload: () => void
}

export function OGPreview({ 
  generatedImage, 
  titleContrastInfo, 
  subtitleContrastInfo, 
  onDownload 
}: OGPreviewProps) {
  if (!generatedImage) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 space-y-3 md:space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Preview (1200×630)</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDownload} 
          className="h-10 px-4 rounded-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PNG
        </Button>
      </div>

      <div className="rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
        <img
          src={generatedImage.dataUrl || "/placeholder.svg"}
          alt="Generated OG Image"
          className="w-full h-auto"
          style={{ aspectRatio: "1200/630" }}
        />
      </div>

      <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
        Size: {(generatedImage.blob.size / 1024).toFixed(1)} KB • 1200×630 pixels
      </div>

      {/* Contrast badges */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Badge
          variant="outline"
          className={`px-3 py-1 text-xs rounded-lg ${titleContrastInfo.badgeClass}`}
          title={titleContrastInfo.tooltip}
        >
          Title: {titleContrastInfo.friendly.replace('Readability: ', '')}
        </Badge>
        <Badge
          variant="outline"
          className={`px-3 py-1 text-xs rounded-lg ${subtitleContrastInfo.badgeClass}`}
          title={subtitleContrastInfo.tooltip}
        >
          Subtitle: {subtitleContrastInfo.friendly.replace('Readability: ', '')}
        </Badge>
      </div>
    </div>
  )
}
