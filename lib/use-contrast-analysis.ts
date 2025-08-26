import { useCallback } from "react"
import { worstContrastForBackgrounds, wcagLevelForText } from "@/lib/utils"

export function useContrastAnalysis(
  textColor: string,
  backgroundColor: string,
  useGradient: boolean,
  gradientStart: string,
  gradientEnd: string
) {
  const getContrastInfo = useCallback(
    (px: number, isBold = false) => {
      const isLarge = px >= 24 || (isBold && px >= 19)
      const backgrounds = useGradient ? [gradientStart, gradientEnd] : [backgroundColor]
      const ratio = worstContrastForBackgrounds(textColor, backgrounds)
      const { level } = wcagLevelForText(ratio, isLarge)
      const badgeClass =
        level === "Fail"
          ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700"
          : level === "AA Large"
          ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700"
          : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700"
      const friendly =
        level === "Fail"
          ? "Readability: Poor"
          : level === "AA Large"
          ? "Readability: Good (for large text)"
          : "Readability: Excellent"
      const suggest = isLarge ? "Recommended ≥ 3.0:1 (large text)" : "Recommended ≥ 4.5:1 (body text)"
      const tooltip = `Contrast ${ratio.toFixed(1)}:1 • Standard ${level} • ${suggest}`
      const label = `${ratio.toFixed(1)}:1 • ${level}`
      return { ratio, level, badgeClass, label, friendly, tooltip }
    },
    [useGradient, gradientStart, gradientEnd, backgroundColor, textColor]
  )

  return { getContrastInfo }
}
