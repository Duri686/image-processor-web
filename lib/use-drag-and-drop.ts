"use client"

import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"

// 支持的图片格式 MIME 类型
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/avif'
] as const

// 检查文件是否为支持的图片格式
const isSupportedImageType = (file: File): boolean => {
  return SUPPORTED_IMAGE_TYPES.includes(file.type as any)
}

interface UseDragAndDropProps {
  onFilesDropped: (files: File[]) => void
}

export const useDragAndDrop = ({ onFilesDropped }: UseDragAndDropProps) => {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // 只有当离开整个窗口时才隐藏拖拽覆盖层
    if (e.clientX === 0 && e.clientY === 0) {
      setIsDragOver(false)
    }
  }, [])

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    console.log('[Global Drag] Drop event triggered')
    const files = Array.from(e.dataTransfer?.files || [])
    console.log('[Global Drag] Files dropped:', files.map(f => ({ name: f.name, type: f.type, size: f.size })))
    
    if (files.length === 0) {
      console.log('[Global Drag] No files detected')
      toast.error("没有检测到文件", {
        description: "请确保拖拽的是有效文件",
        duration: 3000,
      })
      return
    }

    console.log('[Global Drag] Calling onFilesDropped with', files.length, 'files')
    // 直接传递所有文件给 onFilesDropped，让 ImageUploader 统一处理验证和提示
    onFilesDropped(files)
  }, [onFilesDropped])

  // 添加全局拖拽事件监听
  useEffect(() => {
    const handleDragEnterGlobal = (e: DragEvent) => handleDragEnter(e)
    const handleDragLeaveGlobal = (e: DragEvent) => handleDragLeave(e)
    const handleDragOverGlobal = (e: DragEvent) => handleDragOver(e)
    const handleDropGlobal = (e: DragEvent) => handleDrop(e)

    document.addEventListener('dragenter', handleDragEnterGlobal)
    document.addEventListener('dragleave', handleDragLeaveGlobal)
    document.addEventListener('dragover', handleDragOverGlobal)
    document.addEventListener('drop', handleDropGlobal)

    return () => {
      document.removeEventListener('dragenter', handleDragEnterGlobal)
      document.removeEventListener('dragleave', handleDragLeaveGlobal)
      document.removeEventListener('dragover', handleDragOverGlobal)
      document.removeEventListener('drop', handleDropGlobal)
    }
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop])

  return {
    isDragOver
  }
}
