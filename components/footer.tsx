import { Github, Heart, ExternalLink } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left section - Project info */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span>Built with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>by</span>
              <Link 
                href="https://github.com/Duri686" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Duri686
              </Link>
            </div>
            <div className="hidden md:block text-gray-300 dark:text-gray-700">•</div>
            <div className="flex items-center gap-1">
              <span>© 2025 Image Optimizer</span>
            </div>
          </div>

          {/* Right section - Links */}
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/Duri686/image-processor-web"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>Open Source</span>
            </Link>
            <Link
              href="https://img.geo4ai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Live Demo</span>
            </Link>
          </div>
        </div>

        {/* Bottom section - License */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="text-center text-xs text-gray-500 dark:text-gray-500">
            <span>Released under the </span>
            <Link
              href="https://github.com/Duri686/image-processor-web/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              MIT License
            </Link>
            <span> • Pure client-side processing, no data uploaded to servers</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
