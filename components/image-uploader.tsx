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
  const [isUploading, setIsUploading] = useState(false);

  const handleFileProcessing = useCallback(
    (files: File[]) => {
      console.log(
        'Files received:',
        files.map((f) => ({ name: f.name, type: f.type, size: f.size })),
      );

      const supportedImageFiles = files.filter((file) =>
        isSupportedImageType(file),
      );
      const unsupportedFiles = files.filter(
        (file) => !isSupportedImageType(file),
      );

      console.log('Supported files:', supportedImageFiles.length);
      console.log('Unsupported files:', unsupportedFiles.length);

      if (unsupportedFiles.length > 0) {
        const fileTypes = [
          ...new Set(
            unsupportedFiles.map((file) => {
              const ext = file.name.split('.').pop()?.toLowerCase() || '未知';
              return ext;
            }),
          ),
        ];

        toast.error('不支持的文件类型', {
          description: `${
            unsupportedFiles.length
          } 个文件被拒绝（${fileTypes.join(
            ', ',
          )}），仅支持 JPEG、PNG、WebP、AVIF 格式`,
          duration: 4000,
        });
      }

      if (supportedImageFiles.length > 0) {
        setIsUploading(true);
        setTimeout(() => {
          onFilesSelected(supportedImageFiles);
          setIsUploading(false);
          toast.success('图片添加成功', {
            description: `${supportedImageFiles.length} 张图片已准备好进行处理`,
            duration: 3000,
          });
        }, 500);
      } else if (unsupportedFiles.length === 0) {
        toast.error('未选择文件', {
          description: '请选择至少一个图片文件',
          duration: 3000,
        });
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
      handleFileProcessing(files);
    },
    [handleFileProcessing],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      handleFileProcessing(files);
      e.target.value = '';
    },
    [handleFileProcessing],
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div
        className={cn(
          'relative flex min-h-[200px] w-full items-center justify-center rounded-lg border-2 border-dashed transition-colors',
          isDragOver
            ? 'border-primary bg-primary/10'
            : 'border-gray-300 bg-gray-50',
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isUploading ? 'Processing...' : 'Upload Images'}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
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
      <p className="text-xs text-gray-500 mt-3 text-center">
        Supported formats: JPEG, PNG, WebP, AVIF • Max 10MB per file
      </p>
    </div>
  );
}
