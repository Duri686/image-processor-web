'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { ImageUploader } from '@/components/image-uploader';
import { FormatSelector, type ImageFormat } from '@/components/format-selector';
import { QualityControl } from '@/components/quality-control';
import { ImageList } from '@/components/image-list';
import { DragOverlay } from '@/components/drag-overlay';
import { useDragAndDrop } from '@/lib/use-drag-and-drop';
import { useImageQueue } from '@/lib/use-image-queue';

export default function HomePage() {
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>('webp');
  const [quality, setQuality] = useState(80);

  // Image queue management
  const {
    images,
    isProcessing,
    processingProgress,
    handleFilesSelected,
    handleClearAll,
    handleDownloadAllCompleted,
    handleDownload,
  } = useImageQueue({ quality, selectedFormat });

  // Global drag and drop handling
  const { isDragOver } = useDragAndDrop({
    onFilesDropped: handleFilesSelected,
  });

  return (
    <div className="min-h-screen bg-background relative flex flex-col xl:h-screen xl:overflow-y-hidden">
      <DragOverlay isVisible={isDragOver} format={selectedFormat} />
      <Header />

      <main className="container mx-auto px-4 py-8 lg:py-12 flex-1 flex flex-col min-h-0">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 flex-1 min-h-0">
            {/* Left Panel - Enhanced */}
            <div className="xl:col-span-5 space-y-6 lg:space-y-8">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-xl shadow-primary/5 p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold text-foreground">
                    Upload & Settings
                  </h2>
                </div>

                <div className="space-y-6">
                  <FormatSelector
                    selectedFormat={selectedFormat}
                    onFormatChange={setSelectedFormat}
                  />

                  <QualityControl
                    quality={quality}
                    onQualityChange={setQuality}
                    selectedFormat={selectedFormat}
                  />

                  <ImageUploader onFilesSelected={handleFilesSelected} />
                </div>
              </div>
            </div>

            {/* Right Panel - Enhanced */}
            <div className="xl:col-span-7 flex flex-col min-h-0">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-xl shadow-primary/5 p-6 lg:p-8 flex flex-col h-full min-h-0">
                <div className="flex items-center gap-3 mb-6 flex-shrink-0">
                  <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold text-foreground">
                    Conversion Queue
                  </h2>
                  {/* {images.length > 0 && (
                    <div className="ml-auto">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                        {images.length} {images.length === 1 ? 'image' : 'images'}
                      </span>
                    </div>
                  )} */}
                </div>

                <div className="flex-1 min-h-0">
                  <ImageList
                    images={images}
                    isProcessing={isProcessing}
                    processingProgress={processingProgress}
                    onDownload={handleDownload}
                    onDownloadAllCompleted={handleDownloadAllCompleted}
                    onClearAll={handleClearAll}
                    selectedFormat={selectedFormat}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
