'use client';

import { memo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import type { ImageFormat } from './format-selector';

interface QualityControlProps {
  quality: number;
  onQualityChange: (quality: number) => void;
  selectedFormat: ImageFormat;
}

export const QualityControl = memo<QualityControlProps>(
  ({ quality, onQualityChange, selectedFormat }) => {
    const getQualityLabel = (quality: number) => {
      if (quality >= 90) return 'Maximum';
      if (quality >= 70) return 'High';
      if (quality >= 50) return 'Balanced';
      return 'Compressed';
    };

    // PNG is lossless, no quality control needed
    if (selectedFormat === 'png') {
      return (
        <div className="space-y-3">
          <label className="text-sm font-medium text-card-foreground/80 block mb-1">
            Quality
          </label>
          <Alert variant="info">
            <Info className="h-4 w-4" />
            <AlertDescription>
              PNG format uses lossless compression. Quality setting is not
              applicable.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between ">
          <label className="text-sm font-medium block mb-1 text-card-foreground/80">
            Quality
          </label>
          <span className="text-sm font-medium text-card-foreground/80">
            {getQualityLabel(quality)} ({quality}%)
          </span>
        </div>

        <div className="space-y-2">
          <Slider
            value={[quality]}
            onValueChange={(value: number[]) => onQualityChange(value[0])}
            max={100}
            min={10}
            step={5}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Smaller File</span>
            <span>Balanced</span>
            <span>Higher Quality</span>
          </div>
        </div>
      </div>
    );
  },
);

QualityControl.displayName = 'QualityControl';
