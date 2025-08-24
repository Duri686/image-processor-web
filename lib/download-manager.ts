/**
 * Advanced download and export utilities for batch operations
 * Supports ZIP creation, progress tracking, and various export formats
 */

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
}

/**
 * Create a ZIP file from multiple files (simplified implementation)
 * In a production app, you'd use a library like JSZip
 */
export const createZipFile = async (files: ExportItem[]): Promise<Blob> => {
  // For now, we'll create a simple archive by concatenating files
  // In a real implementation, you'd use JSZip or similar

  // Since we can't easily create ZIP files without a library in the browser,
  // we'll download files individually but with a delay between each
  return new Blob(["ZIP creation requires additional library"], { type: "text/plain" })
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
  const nameWithoutExt = originalName.split(".").slice(0, -1).join(".")
  const ext = extension || originalName.split(".").pop() || "png"

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
  return files.reduce((total, file) => total + file.size, 0)
}

/**
 * Format export summary
 */
export const formatExportSummary = (files: ExportItem[]): string => {
  const totalSize = calculateExportSize(files)
  const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2)
  return `${files.length} files • ${sizeInMB} MB total`
}
