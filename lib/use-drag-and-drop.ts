"use client"

import { useState, useCallback, useEffect } from 'react';

interface UseDragAndDropProps {
  onFilesDropped: (files: File[]) => void;
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

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        onFilesDropped(files);
      }
    },
    [onFilesDropped],
  );

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
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  return {
    isDragOver
  }
}
