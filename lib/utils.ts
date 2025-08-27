import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Color utilities for contrast (WCAG)
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  if (!hex) return null
  let h = hex.trim()
  if (h.startsWith("#")) h = h.slice(1)
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16)
    const g = parseInt(h[1] + h[1], 16)
    const b = parseInt(h[2] + h[2], 16)
    return { r, g, b }
  }
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    return { r, g, b }
  }
  return null
}

export function relativeLuminance(hex: string): number | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  const toLinear = (c: number) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  }
  const r = toLinear(rgb.r)
  const g = toLinear(rgb.g)
  const b = toLinear(rgb.b)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(fgHex: string, bgHex: string): number {
  const L1 = relativeLuminance(fgHex)
  const L2 = relativeLuminance(bgHex)
  if (L1 == null || L2 == null) return 0
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function worstContrastForBackgrounds(
  fgHex: string,
  backgrounds: string[]
): number {
  if (!backgrounds.length) return 0
  return backgrounds.reduce((min, bg) => {
    const c = contrastRatio(fgHex, bg)
    return Math.min(min, c)
  }, Infinity)
}

export function wcagLevelForText(
  ratio: number,
  isLargeText: boolean
): { level: "AAA" | "AA" | "AA Large" | "Fail" } {
  if (isLargeText) {
    if (ratio >= 7) return { level: "AAA" }
    if (ratio >= 4.5) return { level: "AA" }
    if (ratio >= 3) return { level: "AA Large" }
    return { level: "Fail" }
  } else {
    if (ratio >= 7) return { level: "AAA" }
    if (ratio >= 4.5) return { level: "AA" }
    return { level: "Fail" }
  }
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (!+bytes) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
