import { type ChangeEvent } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { GRADIENT_PRESETS } from "@/lib/use-og-image-state"

interface OGTypographyControlsProps {
  fontSize: number
  subtitleSize: number
  useGradient: boolean
  gradientStart: string
  gradientEnd: string
  gradientAngle: number
  onFontSizeChange: (size: number) => void
  onSubtitleSizeChange: (size: number) => void
  onGradientStartChange: (color: string) => void
  onGradientEndChange: (color: string) => void
  onGradientAngleChange: (angle: number) => void
  onGradientPresetSelect: (preset: typeof GRADIENT_PRESETS[0]) => void
  disabled?: boolean
}

export function OGTypographyControls({
  fontSize,
  subtitleSize,
  useGradient,
  gradientStart,
  gradientEnd,
  gradientAngle,
  onFontSizeChange,
  onSubtitleSizeChange,
  onGradientStartChange,
  onGradientEndChange,
  onGradientAngleChange,
  onGradientPresetSelect,
  disabled
}: OGTypographyControlsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 space-y-3 md:space-y-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Typography</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Title Size</Label>
            <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs font-mono text-gray-700 dark:text-gray-300">{fontSize}px</div>
          </div>
          <Slider
            value={[fontSize]}
            onValueChange={(value) => onFontSizeChange(value[0])}
            min={40}
            max={120}
            step={4}
            disabled={disabled}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>40px</span>
            <span className="font-medium">Medium</span>
            <span>120px</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Subtitle Size</Label>
            <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs font-mono text-gray-700 dark:text-gray-300">{subtitleSize}px</div>
          </div>
          <Slider
            value={[subtitleSize]}
            onValueChange={(value) => onSubtitleSizeChange(value[0])}
            min={20}
            max={60}
            step={2}
            disabled={disabled}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>20px</span>
            <span className="font-medium">Small</span>
            <span>60px</span>
          </div>
        </div>
      </div>

      {useGradient && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Gradient</Label>

          {/* Gradient color pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Start Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={gradientStart}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => onGradientStartChange(e.target.value)}
                  className="w-12 h-10 p-1 rounded-lg bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 cursor-pointer"
                  disabled={disabled}
                />
                <Input
                  value={gradientStart}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => onGradientStartChange(e.target.value)}
                  className="flex-1 h-10 rounded-lg bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  disabled={disabled}
                  placeholder="#000000"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">End Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={gradientEnd}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => onGradientEndChange(e.target.value)}
                  className="w-12 h-10 p-1 rounded-lg bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 cursor-pointer"
                  disabled={disabled}
                />
                <Input
                  value={gradientEnd}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => onGradientEndChange(e.target.value)}
                  className="flex-1 h-10 rounded-lg bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  disabled={disabled}
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>

          {/* Gradient angle */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Angle: {gradientAngle}°</Label>
            <Slider
              value={[gradientAngle]}
              onValueChange={(v: number[]) => onGradientAngleChange(v[0])}
              min={0}
              max={360}
              step={1}
              disabled={disabled}
              className="w-full"
            />
          </div>

          {/* Quick presets */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Quick Presets</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {GRADIENT_PRESETS.map((p) => (
                <Button
                  key={p.name}
                  variant="outline"
                  size="sm"
                  className="h-10 text-xs rounded-lg border-gray-200 dark:border-gray-600 text-white font-medium"
                  onClick={() => onGradientPresetSelect(p)}
                  style={{ background: p.value, color: "#fff" }}
                  disabled={disabled}
                >
                  {p.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
