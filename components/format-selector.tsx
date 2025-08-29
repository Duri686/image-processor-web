'use client';

import { memo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type ImageFormat = 'webp' | 'jpeg' | 'png' | 'avif';

const FORMATS: { id: ImageFormat; label: string }[] = [
  { id: 'webp', label: 'WebP' },
  { id: 'jpeg', label: 'JPEG' },
  { id: 'png', label: 'PNG' },
  { id: 'avif', label: 'AVIF' },
];

interface FormatSelectorProps {
  selectedFormat: ImageFormat;
  onFormatChange: (format: ImageFormat) => void;
}

export const FormatSelector = memo<FormatSelectorProps>(
  ({ selectedFormat, onFormatChange }) => {
    return (
      <div className="space-y-3">
        <label className="text-sm font-medium text-card-foreground/80 block mb-1">
          Target Format
        </label>

        {/* Mobile: Select */}
        <div className="md:hidden">
          <Select value={selectedFormat} onValueChange={onFormatChange}>
            <SelectTrigger className="h-12 rounded-lg bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FORMATS.map((format) => (
                <SelectItem key={format.id} value={format.id}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop: Tabs */}
        <div className="hidden md:block">
          <Tabs value={selectedFormat} onValueChange={onFormatChange}>
            <TabsList className="grid w-full grid-cols-4 bg-muted rounded-lg p-1">
              {FORMATS.map((format) => (
                <TabsTrigger
                  key={format.id}
                  value={format.id}
                  className="rounded-md py-2 px-4 data-[state=active]:bg-primary  data-[state=active]:text-primary-foreground"
                >
                  {format.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
    );
  },
);

FormatSelector.displayName = 'FormatSelector';
