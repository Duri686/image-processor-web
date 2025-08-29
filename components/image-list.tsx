'use client';

import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { formatBytes } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  Loader2,
  ImageIcon,
} from 'lucide-react';
import type { ImageFile } from '@/lib/use-image-queue';
import { ImageFormat } from './format-selector';

export interface ProcessingProgress {
  fileName: string;
  progress: number;
}

interface ImageListProps {
  images: ImageFile[];
  isProcessing: boolean;
  processingProgress: ProcessingProgress | null;
  onDownload: (id: string) => void;
  onDownloadAllCompleted: () => void;
  onClearAll: () => void;
  selectedFormat: ImageFormat;
}

export const ImageList: React.FC<ImageListProps> = memo(
  ({
    images,
    isProcessing,
    processingProgress,
    onDownload,
    onDownloadAllCompleted,
    onClearAll,
    selectedFormat,
  }: ImageListProps) => {
    const [downloadingId, setDownloadingId] = React.useState<string | null>(
      null,
    );
    const [isClearing, setIsClearing] = React.useState(false);
    const [isDownloadingAll, setIsDownloadingAll] = React.useState(false);
    const processedCount = images.filter((img) => img.processedImage).length;

    const handleDownloadClick = (id: string) => {
      if (downloadingId) return;
      onDownload(id);
      setDownloadingId(id);
      setTimeout(() => setDownloadingId(null), 1500);
    };

    const handleClearAllClick = () => {
      if (images.length === 0 || isClearing) return;
      setIsClearing(true);
      setTimeout(() => {
        onClearAll();
        setIsClearing(false);
      }, 500);
    };

    const handleDownloadAllClick = () => {
      if (isDownloadingAll) return;
      setIsDownloadingAll(true);
      onDownloadAllCompleted();
      setTimeout(() => {
        setIsDownloadingAll(false);
      }, 1500);
    };

    const getImageStatus = (image: ImageFile) => {
      if (image.processedImage) return 'completed';
      if (
        isProcessing &&
        processingProgress &&
        processingProgress.fileName === image.file.name
      )
        return 'processing';
      return 'queued';
    };

    return (
      <div className="h-full flex flex-col min-h-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 flex-shrink-0 gap-4 sm:gap-0">
          <div className="flex items-center gap-3">
            {images.length > 0 && (
              <div className="ml-auto">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground">
                  {images.length} {images.length === 1 ? 'image' : 'images'}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {processedCount > 0 && (
              <Button
                onClick={handleDownloadAllClick}
                variant="ghost"
                size="sm"
                className="cursor-pointer h-10 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                disabled={isDownloadingAll}
              >
                {isDownloadingAll ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Download All
              </Button>
            )}

            {images.length > 0 && (
              <Button
                onClick={handleClearAllClick}
                variant="ghost"
                size="sm"
                className="cursor-pointer h-10 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                disabled={isClearing}
              >
                {isClearing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Clear All
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 bg-accent rounded-md flex items-center justify-center mb-6">
                <ImageIcon className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Ready to Process
              </h3>
              <p className="text-muted-foreground max-w-sm">
                Upload your images to start converting them to your preferred
                format with optimized quality.
              </p>
            </div>
          ) : (
            <div className="h-full overflow-y-auto pr-2">
              <div className="space-y-4">
                {images.map((image) => {
                  const status = getImageStatus(image);

                  return (
                    <div
                      key={image.id}
                      className="group relative bg-card/60 backdrop-blur-sm rounded-xl border p-4 hover:border-primary hover:bg-primary/10 hover:shadow transition-all duration-300"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <div className="relative w-14 h-14 rounded-md overflow-hidden bg-accent flex-shrink-0">
                          <img
                            src={URL.createObjectURL(image.file)}
                            alt={image.file.name}
                            className="w-full h-full object-cover"
                          />
                          {status === 'processing' && (
                            <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                              <Loader2 className="w-6 h-6 text-primary animate-spin" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 w-full sm:flex-1">
                          <p className="font-semibold text-foreground truncate mb-2">
                            {image.file.name}
                          </p>
                          <div className="flex items-center gap-3 flex-wrap">
                            {status === 'completed' && (
                              <Badge
                                variant="success"
                                className="font-medium uppercase bg-accent"
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                {image.convertedFormat || selectedFormat}
                              </Badge>
                            )}
                            {status === 'processing' && (
                              <Badge variant="info" className="font-medium">
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                Processing
                              </Badge>
                            )}
                            {status === 'queued' && (
                              <Badge variant="warning" className="font-medium">
                                <Clock className="w-3 h-3 mr-1" />
                                Queued
                              </Badge>
                            )}

                            <div className="text-sm text-muted-foreground font-medium">
                              {formatBytes(image.file.size)}
                              {image.processedImage &&
                                image.processedImage.blob && (
                                  <>
                                    <span className="text-muted-foreground/50 mx-2">
                                      →
                                    </span>
                                    {formatBytes(
                                      image.processedImage.blob.size,
                                    )}
                                    {(() => {
                                      const originalSize = image.file.size;
                                      const processedSize =
                                        image.processedImage.blob.size;
                                      const change =
                                        originalSize > 0
                                          ? ((processedSize - originalSize) /
                                              originalSize) *
                                            100
                                          : 0;
                                      const changeColor =
                                        change > 0
                                          ? 'text-destructive'
                                          : 'text-primary';
                                      const changePrefix =
                                        change > 0 ? '+' : '';

                                      return (
                                        <span
                                          className={`ml-2 font-semibold ${changeColor}`}
                                        >
                                          ({changePrefix}
                                          {change.toFixed(0)}%)
                                        </span>
                                      );
                                    })()}
                                  </>
                                )}
                            </div>
                          </div>
                        </div>

                        {status === 'completed' && (
                          <Button
                            onClick={() => handleDownloadClick(image.id)}
                            size="sm"
                            className="cursor-pointer h-10 px-4 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto mt-3 sm:mt-0"
                            disabled={!!downloadingId}
                          >
                            {downloadingId === image.id ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Downloaded
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
);

ImageList.displayName = 'ImageList';
