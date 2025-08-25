"use client"

import { ImageIcon } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-sm border-b border-white/30 shadow-sm">
      <div className="container mx-auto px-6 h-20 flex items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
            <ImageIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-serif text-gray-900">Image Optimizer</h1>
            <p className="text-sm text-gray-600 mt-0.5">Professional image processing tool</p>
          </div>
        </div>
      </div>
    </header>
  )
}
