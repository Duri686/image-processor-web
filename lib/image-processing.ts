import { compress, CompressionOptions } from '@thaparoyal/image-compression';

/**
 * Core image processing utilities for client-side image optimization
 * Supports compression, format conversion, and resizing using @thaparoyal/image-compression
 */

export interface ImageProcessingOptions {
  quality?: number; // 0-1, default 0.9
  maxWidth?: number;
  maxHeight?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  targetSizeKB?: number; // Target file size in KB
  progressive?: boolean; // For JPEG progressive encoding
  preserveMetadata?: boolean; // Whether to preserve EXIF data
}

export interface ProcessedImage {
  blob: Blob;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  width: number;
  height: number;
  filename: string;
}

/**
 * Load an image file and return its dimensions
 */
export const loadImageDimensions = (file: File | Blob): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src); // Clean up
    };
    img.onerror = (err) => {
      reject(err);
      URL.revokeObjectURL(img.src); // Clean up
    };
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Process image with compression and format conversion using @thaparoyal/image-compression
 */
export async function processImage(
  file: File,
  options: ImageProcessingOptions,
): Promise<ProcessedImage> {
  console.log(`[processImage] Starting processing for: ${file.name}`);
  console.log(`[processImage] Original size: ${(file.size / 1024).toFixed(2)} KB`);
  console.log('[processImage] Options received:', options);

  const newFilename = file.name.replace(/\.[^/.]+$/, '') + `.${options.format || 'webp'}`;

  const originalDimensions = await loadImageDimensions(file);

  const compressionOptions: CompressionOptions = {
    maxSizeMB: options.targetSizeKB ? options.targetSizeKB / 1024 : Infinity,
    quality: options.quality,
    maxWidth: originalDimensions.width,
    maxHeight: originalDimensions.height,
    preferredFormat: options.format,
    preserveExif: options.preserveMetadata,
    progressive: options.progressive,
    outputFilename: newFilename,
  };

  try {
    console.log('[processImage] Compression options:', compressionOptions);
    const compressedFile = await compress(file, compressionOptions);
    const dataUrl = URL.createObjectURL(compressedFile);
    console.log(
      `[processImage] Compressed size: ${(compressedFile.size / 1024).toFixed(2)} KB`,
    );

    const finalDimensions = await loadImageDimensions(compressedFile);

    return {
      blob: compressedFile, // The returned value is a File, which is a Blob
      dataUrl,
      originalSize: file.size,
      compressedSize: compressedFile.size,
      compressionRatio: (file.size - compressedFile.size) / file.size,
      width: finalDimensions.width,
      height: finalDimensions.height,
      filename: compressedFile.name, // Use the name from the returned File object
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error(
      `Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Download processed image
 */
export const downloadImage = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  );
};

