/**
 * Core image processing utilities for client-side image optimization
 * Supports compression, format conversion, and resizing using Canvas API
 */

export interface ImageProcessingOptions {
  quality?: number // 0-1, default 0.8
  maxWidth?: number
  maxHeight?: number
  format?: "jpeg" | "png" | "webp"
  targetSizeKB?: number // Target file size in KB
  progressive?: boolean // For JPEG progressive encoding
  preserveMetadata?: boolean // Whether to preserve EXIF data
}

export interface ProcessedImage {
  blob: Blob
  dataUrl: string
  originalSize: number
  compressedSize: number
  compressionRatio: number
  width: number
  height: number
}

/**
 * Load an image file and return HTMLImageElement
 */
export const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous" // Prevent CORS issues
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Calculate optimal dimensions while maintaining aspect ratio
 */
export const calculateDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth?: number,
  maxHeight?: number,
): { width: number; height: number } => {
  let { width, height } = { width: originalWidth, height: originalHeight }

  if (maxWidth && width > maxWidth) {
    height = (height * maxWidth) / width
    width = maxWidth
  }

  if (maxHeight && height > maxHeight) {
    width = (width * maxHeight) / height
    height = maxHeight
  }

  return { width: Math.round(width), height: Math.round(height) }
}

/**
 * Process image with compression and format conversion
 */
export const processImage = async (file: File, options: ImageProcessingOptions = {}): Promise<ProcessedImage> => {
  const { quality = 0.8, maxWidth, maxHeight, format = "jpeg", progressive = false } = options

  try {
    const img = await loadImage(file)
    const { width, height } = calculateDimensions(img.naturalWidth, img.naturalHeight, maxWidth, maxHeight)

    // Create canvas and draw resized image
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    canvas.width = width
    canvas.height = height

    // Fill with white background for JPEG to avoid transparency issues
    if (format === "jpeg") {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, width, height)
    }

    ctx.drawImage(img, 0, 0, width, height)

    // Convert to blob with specified format and quality
    const mimeType = `image/${format}`
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Failed to create blob"))
          }
        },
        mimeType,
        quality,
      )
    })

    const dataUrl = canvas.toDataURL(mimeType, quality)
    const compressionRatio = ((file.size - blob.size) / file.size) * 100

    // Clean up
    URL.revokeObjectURL(img.src)

    return {
      blob,
      dataUrl,
      originalSize: file.size,
      compressedSize: blob.size,
      compressionRatio: Math.max(0, compressionRatio),
      width,
      height,
    }
  } catch (error) {
    console.error("Error processing image:", error)
    throw new Error(`Failed to process image: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Generate favicon in multiple sizes
 */
export const generateFavicon = async (
  file: File,
  sizes: number[] = [16, 32, 48],
): Promise<{ size: number; blob: Blob; dataUrl: string }[]> => {
  const img = await loadImage(file)
  const results = []

  for (const size of sizes) {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!
    canvas.width = size
    canvas.height = size

    // Enable high-quality image smoothing
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    // Fill with transparent background for PNG
    ctx.clearRect(0, 0, size, size)

    // Calculate dimensions to fit image in square canvas while maintaining aspect ratio
    const sourceAspectRatio = img.naturalWidth / img.naturalHeight
    let drawWidth = size
    let drawHeight = size
    let offsetX = 0
    let offsetY = 0

    if (sourceAspectRatio > 1) {
      // Image is wider than tall
      drawHeight = size / sourceAspectRatio
      offsetY = (size - drawHeight) / 2
    } else if (sourceAspectRatio < 1) {
      // Image is taller than wide
      drawWidth = size * sourceAspectRatio
      offsetX = (size - drawWidth) / 2
    }

    // Draw image centered in canvas
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), "image/png")
    })

    const dataUrl = canvas.toDataURL("image/png")

    results.push({ size, blob, dataUrl })
  }

  // Clean up
  URL.revokeObjectURL(img.src)

  return results
}

/**
 * Generate OG image with text overlay
 */
export interface OGImageOptions {
  width?: number
  height?: number
  backgroundColor?: string
  textColor?: string
  title?: string
  subtitle?: string
}

export const generateOGImage = async (options: OGImageOptions = {}): Promise<{ blob: Blob; dataUrl: string }> => {
  const {
    width = 1200,
    height = 630,
    backgroundColor = "#ffffff",
    textColor = "#374151",
    title = "Your Title Here",
    subtitle = "Your subtitle here",
  } = options

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!
  canvas.width = width
  canvas.height = height

  // Fill background
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, width, height)

  // Set text properties
  ctx.fillStyle = textColor
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  // Draw title
  ctx.font = "bold 72px system-ui, -apple-system, sans-serif"
  ctx.fillText(title, width / 2, height / 2 - 40)

  // Draw subtitle
  ctx.font = "36px system-ui, -apple-system, sans-serif"
  ctx.fillText(subtitle, width / 2, height / 2 + 40)

  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png")
  })

  const dataUrl = canvas.toDataURL("image/png")

  return { blob, dataUrl }
}

/**
 * Download processed image
 */
export const downloadImage = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const compressToTargetSize = async (
  file: File,
  targetSizeKB: number,
  options: Omit<ImageProcessingOptions, "targetSizeKB"> = {},
): Promise<ProcessedImage> => {
  const targetBytes = targetSizeKB * 1024
  let quality = 0.9
  let result: ProcessedImage
  let attempts = 0
  const maxAttempts = 10

  do {
    result = await processImage(file, { ...options, quality })

    if (result.compressedSize <= targetBytes || attempts >= maxAttempts) {
      break
    }

    // Adjust quality based on how far we are from target
    const ratio = targetBytes / result.compressedSize
    quality = Math.max(0.1, quality * ratio * 0.9)
    attempts++
  } while (attempts < maxAttempts)

  return result
}

export const compressBatch = async (
  files: File[],
  options: ImageProcessingOptions = {},
  onProgress?: (completed: number, total: number, currentFile: string) => void,
): Promise<ProcessedImage[]> => {
  const results: ProcessedImage[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    onProgress?.(i, files.length, file.name)

    try {
      const result = options.targetSizeKB
        ? await compressToTargetSize(file, options.targetSizeKB, options)
        : await processImage(file, options)
      results.push(result)
    } catch (error) {
      console.error(`Failed to process ${file.name}:`, error)
      // Create a failed result to maintain array consistency
      results.push({
        blob: new Blob(),
        dataUrl: "",
        originalSize: file.size,
        compressedSize: file.size,
        compressionRatio: 0,
        width: 0,
        height: 0,
      })
    }
  }

  onProgress?.(files.length, files.length, "Complete")
  return results
}

export const COMPRESSION_PRESETS = {
  web: { quality: 0.8, maxWidth: 1920, maxHeight: 1080, format: "jpeg" as const },
  thumbnail: { quality: 0.7, maxWidth: 300, maxHeight: 300, format: "jpeg" as const },
  social: { quality: 0.85, maxWidth: 1200, maxHeight: 630, format: "jpeg" as const },
  print: { quality: 0.95, format: "jpeg" as const },
  lossless: { quality: 1.0, format: "png" as const },
  webp_high: { quality: 0.8, format: "webp" as const },
  webp_small: { quality: 0.6, format: "webp" as const },
} as const

export type CompressionPreset = keyof typeof COMPRESSION_PRESETS

export const applyPreset = async (file: File, preset: CompressionPreset): Promise<ProcessedImage> => {
  return processImage(file, COMPRESSION_PRESETS[preset])
}

/**
 * Generate ICO file from multiple PNG images (for legacy browser support)
 */
export const generateICOFile = async (pngBlobs: { size: number; blob: Blob }[]): Promise<Blob> => {
  // This is a simplified ICO generator
  // In a production app, you might want to use a more robust ICO library

  // For now, we'll just return the 32x32 PNG as fallback
  const fallbackFavicon = pngBlobs.find((f) => f.size === 32) || pngBlobs[0]
  return fallbackFavicon.blob
}

/**
 * Generate complete favicon package with HTML snippets
 */
export const generateFaviconPackage = async (
  file: File,
  options: {
    includeSizes?: number[]
    includeAppleTouchIcon?: boolean
    includeManifestIcons?: boolean
  } = {},
): Promise<{
  favicons: { size: number; blob: Blob; dataUrl: string; filename: string }[]
  htmlSnippets: string[]
}> => {
  const {
    includeSizes = [16, 32, 48, 180, 192, 512],
    includeAppleTouchIcon = true,
    includeManifestIcons = true,
  } = options

  const favicons = await generateFavicon(file, includeSizes)
  const faviconFiles = favicons.map((f) => ({
    ...f,
    filename:
      f.size === 180
        ? "apple-touch-icon.png"
        : f.size === 192 || f.size === 512
          ? `android-chrome-${f.size}x${f.size}.png`
          : `favicon-${f.size}x${f.size}.png`,
  }))

  const htmlSnippets = [
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
    '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
  ]

  if (includeAppleTouchIcon) {
    htmlSnippets.push('<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">')
  }

  if (includeManifestIcons) {
    htmlSnippets.push('<link rel="manifest" href="/site.webmanifest">')
  }

  return { favicons: faviconFiles, htmlSnippets }
}
