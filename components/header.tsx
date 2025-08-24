"use client"

import { ImageIcon } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <ImageIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif text-foreground">Image Optimizer</h1>
            <p className="text-xs text-muted-foreground">Professional image processing tool</p>
          </div>
        </div>
      </div>
    </header>
  )
}
