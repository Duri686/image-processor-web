import { Github, Heart, ExternalLink } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-md shadow-lg shadow-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left section - Project info */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Built with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
              <span>by</span>
              <Link 
                href="https://github.com/Duri686" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/90 transition-colors font-medium"
              >
                Duri686
              </Link>
            </div>
            <div className="hidden md:block text-muted-foreground/30">•</div>
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
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-accent"
            >
              <Github className="h-4 w-4" />
              <span>Open Source</span>
            </Link>
          </div>
        </div>

        {/* Bottom section - License */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="text-center text-xs text-muted-foreground">
            <span>Released under the </span>
            <Link
              href="https://github.com/Duri686/image-processor-web/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/90 transition-colors font-medium"
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
