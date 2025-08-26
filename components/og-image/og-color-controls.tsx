import { type ChangeEvent } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BACKGROUND_PRESETS } from "@/lib/use-og-image-state"

interface OGColorControlsProps {
  backgroundColor: string
  textColor: string
  useGradient: boolean
  onBackgroundColorChange: (color: string) => void
  onTextColorChange: (color: string) => void
  onUseGradientChange: (useGradient: boolean) => void
  onPresetSelect: (preset: typeof BACKGROUND_PRESETS[0]) => void
  disabled?: boolean
}

export function OGColorControls({
  backgroundColor,
  textColor,
  useGradient,
  onBackgroundColorChange,
  onTextColorChange,
  onUseGradientChange,
  onPresetSelect,
  disabled
}: OGColorControlsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 space-y-3 md:space-y-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Colors</h3>

      {/* Solid color tools are hidden when gradient mode is on */}
      {!useGradient && (
        <>
          {/* Color Presets (Solid) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Color Presets</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {BACKGROUND_PRESETS.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => onPresetSelect(preset)}
                  className="h-10 text-xs rounded-lg border-gray-200 dark:border-gray-600 font-medium"
                  style={{ backgroundColor: preset.value, color: preset.textColor }}
                  disabled={disabled}
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Background (Solid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Background Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={backgroundColor}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => onBackgroundColorChange(e.target.value)}
                  className="w-12 h-10 p-1 rounded-lg bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 cursor-pointer"
                  disabled={disabled}
                />
                <Input
                  value={backgroundColor}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => onBackgroundColorChange(e.target.value)}
                  className="flex-1 h-10 rounded-lg bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  disabled={disabled}
                  placeholder="#ffffff"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Text Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={textColor}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => onTextColorChange(e.target.value)}
                  className="w-12 h-10 p-1 rounded-lg bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 cursor-pointer"
                  disabled={disabled}
                />
                <Input
                  value={textColor}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => onTextColorChange(e.target.value)}
                  className="flex-1 h-10 rounded-lg bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  disabled={disabled}
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Gradient Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <div>
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Gradient Background</Label>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Enable gradient instead of solid color</p>
          </div>
        </div>
        <Button
          variant={useGradient ? "default" : "outline"}
          size="sm"
          onClick={() => onUseGradientChange(!useGradient)}
          className="h-10 px-4 text-sm rounded-lg font-medium"
          disabled={disabled}
        >
          {useGradient ? "✓ Enabled" : "Enable"}
        </Button>
      </div>
    </div>
  )
}
