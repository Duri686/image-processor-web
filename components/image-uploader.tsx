'use client';

import type React from 'react';
import { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// 支持的图片格式 MIME 类型
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
] as const;

// 检查文件是否为支持的图片格式
const isSupportedImageType = (file: File): boolean => {
  return SUPPORTED_IMAGE_TYPES.includes(file.type as any);
};

interface ImageUploaderProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export function ImageUploader({
  onFilesSelected,
  accept = 'image/*',
  multiple = true,
  className,
}: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  // The isUploading state can be removed if it's not used for UI feedback anymore,
  // or it can be driven by a prop from the parent component that knows the actual processing state.
  const [isUploading, setIsUploading] = useState(false); 

  const handleFiles = useCallback(
    (files: File[]) => {
      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    [handleFiles],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      handleFiles(files);
      // Reset the input value to allow selecting the same file again
      e.target.value = '';
    },
    [handleFiles],
  );

  return (
    <div className="bg-card rounded-lg border p-6">
      <div
        className={cn(
          'relative flex min-h-[200px] w-full items-center justify-center rounded-lg border-2 border-dashed transition-colors',
          isDragOver
            ? 'border-primary bg-primary/10'
            : 'border-input bg-accent',
          'hover:border-primary hover:bg-primary/10',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={isUploading}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-wait"
        />
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <UploadCloud className="h-8 w-8 text-primary mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {isUploading ? 'Processing...' : 'Upload Images'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {isUploading
              ? 'Your images are being prepared...'
              : 'Drag and drop your images here'}
          </p>
          {!isUploading && (
            <Button variant="outline" className="h-10 rounded-lg">
              Browse Files
            </Button>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-3 text-center">
        Supported formats: JPEG, PNG, WebP, AVIF • Max 10MB per file
      </p>
    </div>
  );
}
