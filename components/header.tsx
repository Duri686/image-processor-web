"use client"

import { useEffect, useMemo, useState } from "react"
import { ImageIcon, Github, Sun, Moon, Star } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

type HeaderSize = "sm" | "md" | "lg"

interface HeaderProps {
  title?: string
  subtitle?: string
  size?: HeaderSize
}

export function Header({
  title = "Image Optimizer",
  subtitle = "Professional image processing tool",
  size = "md",
}: HeaderProps) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted ? (resolvedTheme ?? theme) === "dark" : false

  const heightClass = useMemo(() => {
    switch (size) {
      case "sm":
        return "h-14 md:h-16"
      case "lg":
        return "h-20 md:h-24"
      default:
        return "h-16 md:h-20"
    }
  }, [size])

  const titleClass = useMemo(() => {
    switch (size) {
      case "sm":
        return "text-xl"
      case "lg":
        return "text-3xl"
      default:
        return "text-2xl"
    }
  }, [size])

  const iconPadClass = useMemo(() => {
    switch (size) {
      case "sm":
        return "p-2.5"
      case "lg":
        return "p-3.5"
      default:
        return "p-3"
    }
  }, [size])

  // GitHub star count (with simple localStorage cache)
  // const [stars, setStars] = useState<number | null>(null)
  // useEffect(() => {
  //   const key = "gh_star_count:image-processor-web"
  //   const cached = typeof window !== "undefined" ? localStorage.getItem(key) : null
  //   if (cached) {
  //     try {
  //       const { value, ts } = JSON.parse(cached) as { value: number; ts: number }
  //       // 1h cache
  //       if (Date.now() - ts < 3600_000) setStars(value)
  //     } catch {}
  //   }
  //   if (stars == null) {
  //     fetch("https://api.github.com/repos/Duri686/image-processor-web")
  //       .then((r) => r.ok ? r.json() : Promise.reject(r.status))
  //       .then((data: any) => {
  //         if (typeof data?.stargazers_count === "number") {
  //           setStars(data.stargazers_count)
  //           try {
  //             localStorage.setItem(key, JSON.stringify({ value: data.stargazers_count, ts: Date.now() }))
  //           } catch {}
  //         }
  //       })
  //       .catch(() => {})
  //   }
  // }, [stars])
  // border-t border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 border-b border-white/20 dark:border-gray-800/50 shadow-lg shadow-blue-500/5">
      <div className={`container mx-auto px-4 sm:px-6 ${heightClass} flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <div className={`${iconPadClass} rounded-xl bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 shadow-sm`}>
            <ImageIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </div>
          <div>
            <h1 className={`${titleClass} font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent`}>{title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle - Priority 1 */}
          <Button
            variant="ghost"
            size="sm"
            aria-label="Toggle theme"
            title={mounted ? (isDark ? "Switch to Light" : "Switch to Dark") : "Toggle theme"}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="h-9 w-9 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200/50 dark:hover:border-blue-800/50 transition-all duration-200 border border-transparent"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100 text-blue-400" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* GitHub Repo Link - Priority 2 */}
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex h-9 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200/50 dark:hover:border-blue-800/50 transition-all duration-200 border border-transparent">
            <Link href="https://github.com/Duri686/image-processor-web" target="_blank" rel="noopener noreferrer" title="Open GitHub repository">
              <Github className="h-4 w-4 mr-1.5 text-gray-700 dark:text-gray-300" />
              <span className="text-sm text-gray-700 dark:text-gray-300">GitHub</span>
            </Link>
          </Button>

          {/* GitHub Stars - Priority 3 */}
          {/* {typeof stars === "number" && (
            <div
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50 transition-all duration-200"
              aria-label={`${stars} stars on GitHub`}
              title={`${stars} Stars on GitHub`}
            >
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{stars}</span>
            </div>
          )} */}
        </div>
      </div>
    </header>
  )
}
