'use client';

import { useState, useCallback, useEffect } from 'react';
import { processImage, downloadImage, type ProcessedImage } from './image-processing';
import { createZip, type ExportItem } from './download-manager';
import type { ImageFormat } from '@/components/format-selector';

// 支持的图片格式 MIME 类型
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/avif'
] as const;

// 检查文件是否为支持的图片格式
const isSupportedImageType = (file: File): boolean => {
  return SUPPORTED_IMAGE_TYPES.includes(file.type as any);
};

export interface ImageFile {
  id: string;
  file: File;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  processedImage?: ProcessedImage;
  error?: string;
}

interface UseImageQueueProps {
  selectedFormat: ImageFormat;
  quality: number;
}

export const useImageQueue = ({ selectedFormat, quality }: UseImageQueueProps) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<{ fileName: string; progress: number } | null>(null);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    const { toast } = await import('sonner');
    const supportedFiles = files.filter(isSupportedImageType);
    const unsupportedFiles = files.filter(file => !isSupportedImageType(file));

    if (supportedFiles.length > 0) {
      const newImages: ImageFile[] = supportedFiles.map((file, index) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${index}`,
        file,
        status: 'queued',
      }));
      setImages((prevImages: ImageFile[]) => [...newImages, ...prevImages]);

      if (unsupportedFiles.length > 0) {
        const unsupportedFileTypes = [
          ...new Set(unsupportedFiles.map(f => f.name.split('.').pop()?.toLowerCase() || 'unknown')),
        ].join(', ');
        toast.info(`${supportedFiles.length} images added`, {
          description: `${unsupportedFiles.length} unsupported files were ignored (${unsupportedFileTypes}).`,
          duration: 4000,
        });
      } else {
        toast.success(`${supportedFiles.length} images added successfully`, {
          description: 'Ready for processing.',
          duration: 3000,
        });
      }
    } else if (unsupportedFiles.length > 0) {
      toast.error('Unsupported file types', {
        description: 'Please select valid image files (JPEG, PNG, WebP).',
        duration: 4000,
      });
    } else {
      // This case might not be reachable if the uploader prevents empty selections, but it's good for robustness.
      toast.error('No files selected', {
        description: 'Please select at least one image file.',
        duration: 3000,
      });
    }
  }, []);

  useEffect(() => {
    const processQueue = async () => {
      const imagesToProcess = images.filter((img: ImageFile) => img.status === 'queued');
      if (imagesToProcess.length === 0 || isProcessing) return;

      setIsProcessing(true);

      for (const image of imagesToProcess) {
        setProcessingProgress({ fileName: image.file.name, progress: 0 });
        setImages((prev: ImageFile[]) => prev.map((i: ImageFile) => i.id === image.id ? { ...i, status: 'processing' } : i));
        try {
          const result = await processImage(image.file, {
            format: selectedFormat,
            quality: quality / 100,
          });
          setImages((prev: ImageFile[]) => prev.map((i: ImageFile) => i.id === image.id ? { ...i, status: 'completed', processedImage: result } : i));
        } catch (error) {
          console.error(`Failed to process ${image.file.name}:`, error);
          setImages((prev: ImageFile[]) => prev.map((i: ImageFile) => i.id === image.id ? { ...i, status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' } : i));
        }
      }

      setIsProcessing(false);
      setProcessingProgress(null);
    };

    processQueue();
  }, [images, isProcessing, selectedFormat, quality]);

  useEffect(() => {
    // When quality or format changes, reset processed images to re-queue them
    if (images.some((img: ImageFile) => img.status === 'completed')) {
      setImages((currentImages: ImageFile[]) =>
        currentImages.map((img: ImageFile) => ({ ...img, status: 'queued', processedImage: undefined }))
      );
    }
  }, [quality, selectedFormat]);

  const handleClearAll = useCallback(() => {
    setImages([]);
  }, []);

  const handleDownload = useCallback((image: ImageFile) => {
    if (image.status !== 'completed' || !image.processedImage) return;
    downloadImage(image.processedImage.blob, image.processedImage.filename);
  }, []);

  const handleDownloadAllCompleted = useCallback(async () => {
    const completedImages = images.filter(
      (img: ImageFile): img is ImageFile & { processedImage: ProcessedImage } => 
        img.status === 'completed' && !!img.processedImage
    );

    if (completedImages.length === 0) return;

    const exportItems: ExportItem[] = completedImages.map((img: ImageFile & { processedImage: ProcessedImage }) => ({
      blob: img.processedImage.blob,
      filename: img.processedImage.filename,
      originalName: img.file.name,
      size: img.processedImage.blob.size,
      type: img.processedImage.blob.type,
    }));

    try {
      const zipBlob = await createZip(exportItems, undefined, (progress) => {
        console.log(`Zipping progress: ${progress.toFixed(2)}%`);
      });
      downloadImage(zipBlob, `processed-images-${Date.now()}.zip`);
    } catch (error) {
      console.error('Failed to create ZIP file:', error);
    }
  }, [images]);

  return {
    images,
    isProcessing,
    processingProgress,
    handleFilesSelected,
    handleClearAll,
    handleDownloadAllCompleted,
    handleDownload,
  };
};
