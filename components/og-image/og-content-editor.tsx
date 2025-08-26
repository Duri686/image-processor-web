import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface OGContentEditorProps {
  title: string
  subtitle: string
  onTitleChange: (title: string) => void
  onSubtitleChange: (subtitle: string) => void
  disabled?: boolean
}

export function OGContentEditor({ 
  title, 
  subtitle, 
  onTitleChange, 
  onSubtitleChange, 
  disabled 
}: OGContentEditorProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 space-y-3 md:space-y-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Content</h3>
      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Title</Label>
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter your title"
            disabled={disabled}
            className="h-12 rounded-lg bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Subtitle</Label>
          <Textarea
            value={subtitle}
            onChange={(e) => onSubtitleChange(e.target.value)}
            placeholder="Enter your subtitle"
            rows={3}
            disabled={disabled}
            className="rounded-lg bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none"
          />
        </div>
      </div>
    </div>
  )
}
