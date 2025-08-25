"use client"

import { useCallback, useRef, useState } from "react"

interface TouchGestureOptions {
  onLongPress?: () => void
  onDoubleTap?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  longPressDelay?: number
  doubleTapDelay?: number
  swipeThreshold?: number
}

interface TouchPosition {
  x: number
  y: number
  timestamp: number
}

export function useMobileGestures(options: TouchGestureOptions = {}) {
  const {
    onLongPress,
    onDoubleTap,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    longPressDelay = 500,
    doubleTapDelay = 300,
    swipeThreshold = 50
  } = options

  const [isLongPressing, setIsLongPressing] = useState(false)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const lastTap = useRef<TouchPosition | null>(null)
  const touchStart = useRef<TouchPosition | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    const now = Date.now()
    
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: now
    }

    // 长按检测
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        setIsLongPressing(true)
        onLongPress()
        // 触觉反馈
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(50)
        }
      }, longPressDelay)
    }

    // 双击检测
    if (onDoubleTap && lastTap.current) {
      const timeDiff = now - lastTap.current.timestamp
      const distanceX = Math.abs(touch.clientX - lastTap.current.x)
      const distanceY = Math.abs(touch.clientY - lastTap.current.y)
      
      if (timeDiff < doubleTapDelay && distanceX < 30 && distanceY < 30) {
        onDoubleTap()
        lastTap.current = null
        return
      }
    }

    lastTap.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: now
    }
  }, [onLongPress, onDoubleTap, longPressDelay, doubleTapDelay])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return

    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - touchStart.current.x)
    const deltaY = Math.abs(touch.clientY - touchStart.current.y)

    // 如果移动距离超过阈值，取消长按
    if (longPressTimer.current && (deltaX > 10 || deltaY > 10)) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    if (touchStart.current && e.changedTouches[0]) {
      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStart.current.x
      const deltaY = touch.clientY - touchStart.current.y
      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(deltaY)

      // 滑动手势检测
      if (absDeltaX > swipeThreshold || absDeltaY > swipeThreshold) {
        if (absDeltaX > absDeltaY) {
          // 水平滑动
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight()
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft()
          }
        } else {
          // 垂直滑动
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown()
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp()
          }
        }
      }
    }

    setIsLongPressing(false)
    touchStart.current = null
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, swipeThreshold])

  return {
    isLongPressing,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  }
}

// 移动端设备检测 Hook
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useState(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      return mobileRegex.test(userAgent) || window.innerWidth < 768
    }

    setIsMobile(checkIsMobile())

    const handleResize = () => {
      setIsMobile(checkIsMobile())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  })

  return isMobile
}

// 移动端拖拽上传 Hook
export function useMobileDragUpload(onFilesSelected: (files: FileList) => void) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      onFilesSelected(files)
    }
  }, [onFilesSelected])

  return {
    isDragging,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop
    }
  }
}
