/**
 * Advanced download and export utilities for batch operations
 * Supports ZIP creation, progress tracking, and various export formats
 */

import JSZip from "jszip"

export interface ExportOptions {
  format?: "original" | "zip"
  namePattern?: string // e.g., "{name}_optimized.{ext}"
  includeOriginals?: boolean
  createSubfolders?: boolean
}

export interface ExportItem {
  blob: Blob
  filename: string
  originalName?: string
  size: number
  type: string
  // Optional original file info for including originals in ZIP
  originalBlob?: Blob
  originalSize?: number
  originalType?: string
}

/**
 * Create a ZIP file from multiple files (simplified implementation)
 * In a production app, you'd use a library like JSZip
 */
export const createZipFile = async (files: ExportItem[]): Promise<Blob> => {
  // Deprecated placeholder kept for backward-compat
  return new Blob(["Use createZip() instead"], { type: "text/plain" })
}

/**
 * Create a ZIP using JSZip with progress callback (0-100)
 */
export const createZip = async (
  files: ExportItem[],
  options?: { includeOriginals?: boolean; createSubfolders?: boolean; namePattern?: string },
  onProgress?: (percent: number) => void,
): Promise<Blob> => {
  const zip = new JSZip()
  const includeOriginals = options?.includeOriginals === true
  const useFolders = options?.createSubfolders === true

  const usedNames = new Set<string>()
  for (const file of files) {
    // processed
    const processedPath = useFolders ? `processed/${file.filename}` : file.filename
    zip.file(processedPath, file.blob)
    usedNames.add(processedPath)

    // originals
    if (includeOriginals && file.originalBlob) {
      const rawOriginal = file.originalName || file.filename
      const extFromType = (file.originalType || file.type || "image/png").split("/")[1] || "png"
      const pattern = options?.namePattern
      const namedOriginal = pattern
        ? generateFilename(rawOriginal, pattern, extFromType)
        : rawOriginal
      let originalPath = useFolders ? `originals/${namedOriginal}` : namedOriginal

      if (!useFolders) {
        // avoid collision when no folders
        if (usedNames.has(originalPath)) {
          const dot = originalPath.lastIndexOf(".")
          const name = dot > -1 ? originalPath.slice(0, dot) : originalPath
          const ext = dot > -1 ? originalPath.slice(dot) : ""
          let candidate = `${name}-original${ext}`
          let counter = 1
          while (usedNames.has(candidate)) {
            candidate = `${name}-original-${counter}${ext}`
            counter++
          }
          originalPath = candidate
        }
      }

      zip.file(originalPath, file.originalBlob)
      usedNames.add(originalPath)
    }
  }

  const blob = await zip.generateAsync(
    { type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } },
    (meta: any) => {
      if (typeof meta.percent === "number") onProgress?.(meta.percent)
    },
  )

  return blob
}

/**
 * Download multiple files with progress tracking
 */
export const downloadMultipleFiles = async (
  files: ExportItem[],
  options: ExportOptions = {},
  onProgress?: (completed: number, total: number, currentFile: string) => void,
): Promise<void> => {
  const { format = "original", namePattern = "{name}_optimized.{ext}" } = options

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    onProgress?.(i, files.length, file.filename)

    // Apply naming pattern
    let finalFilename = file.filename
    if (namePattern && file.originalName) {
      const nameWithoutExt = file.originalName.split(".").slice(0, -1).join(".")
      const ext = file.type.split("/")[1] || "png"
      finalFilename = namePattern.replace("{name}", nameWithoutExt).replace("{ext}", ext)
    }

    // Download file
    const url = URL.createObjectURL(file.blob)
    const a = document.createElement("a")
    a.href = url
    a.download = finalFilename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Add delay between downloads to avoid browser blocking
    if (i < files.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  onProgress?.(files.length, files.length, "Complete")
}

/**
 * Generate filename with pattern
 */
export const generateFilename = (originalName: string, pattern: string, extension?: string): string => {
  // 防止 originalName 为 undefined 或空值
  const safeName = originalName || "image"
  const nameWithoutExt = safeName.split(".").slice(0, -1).join(".") || safeName
  const ext = extension || safeName.split(".").pop() || "png"

  return pattern
    .replace("{name}", nameWithoutExt)
    .replace("{ext}", ext)
    .replace("{timestamp}", Date.now().toString())
    .replace("{date}", new Date().toISOString().split("T")[0])
}

/**
 * Calculate total size of export
 */
export const calculateExportSize = (files: ExportItem[]): number => {
  return files.reduce((total, file) => {
    const size = typeof file.size === 'number' && !isNaN(file.size) ? file.size : 0
    return total + size
  }, 0)
}

/**
 * Format export summary
 */
export const formatExportSummary = (files: ExportItem[]): string => {
  const totalSize = calculateExportSize(files)
  const sizeInMB = totalSize > 0 ? (totalSize / (1024 * 1024)).toFixed(2) : '0.00'
  return `${files.length} files • ${sizeInMB} MB total`
}
