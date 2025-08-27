"use client"

import { memo } from "react"
import { Upload } from "lucide-react"

import { ImageFormat } from "./format-selector";

interface DragOverlayProps {
  isVisible: boolean;
  format: ImageFormat;
}

export const DragOverlay = memo<DragOverlayProps>(({ isVisible, format }: DragOverlayProps) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50/80 via-blue-50/60 to-indigo-50/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl shadow-blue-500/10 border border-white/40 max-w-md mx-4 text-center transform scale-105 transition-all duration-300">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <Upload className="w-10 h-10 text-blue-500 animate-bounce" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Drop Images Here
        </h3>
        <p className="text-gray-600">
          Release to upload and convert to <span className="font-bold uppercase text-blue-600">{format}</span>
        </p>
      </div>
    </div>
  )
})

DragOverlay.displayName = 'DragOverlay'
