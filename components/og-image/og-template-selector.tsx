import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OG_TEMPLATES } from "@/lib/use-og-image-generator"

interface OGTemplateSelectorProps {
  selectedTemplate: string
  onTemplateChange: (template: string) => void
  disabled?: boolean
}

export function OGTemplateSelector({ selectedTemplate, onTemplateChange, disabled }: OGTemplateSelectorProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 space-y-3 md:space-y-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Template</h3>
      <Select value={selectedTemplate} onValueChange={onTemplateChange}>
        <SelectTrigger className="h-12 rounded-lg bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100" disabled={disabled}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-lg border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700">
          {OG_TEMPLATES.map((template) => (
            <SelectItem key={template.id} value={template.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600">
              <div className="flex flex-col py-1">
                <span className="font-medium text-gray-900 dark:text-gray-100">{template.name}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{template.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
