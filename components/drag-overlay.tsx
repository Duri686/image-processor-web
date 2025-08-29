'use client';

import { memo } from 'react';
import { Upload } from 'lucide-react';

import { ImageFormat } from './format-selector';

interface DragOverlayProps {
  isVisible: boolean;
  format: ImageFormat;
}

export const DragOverlay = memo<DragOverlayProps>(
  ({ isVisible, format }: DragOverlayProps) => {
    if (!isVisible) return null;

    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-card/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl shadow-primary/10 border border-border max-w-md w-full text-center transform scale-105 transition-all duration-300">
          <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-md flex items-center justify-center mb-6 mx-auto">
            <Upload className="w-10 h-10 text-primary animate-bounce" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Drop Images Here
          </h3>
          <p className="text-muted-foreground">
            Release to upload and convert to{' '}
            <span className="font-bold uppercase text-primary">{format}</span>
          </p>
        </div>
      </div>
    );
  },
);

DragOverlay.displayName = 'DragOverlay';
