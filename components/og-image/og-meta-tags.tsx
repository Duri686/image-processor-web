interface OGMetaTagsProps {
  title: string
  subtitle: string
}

export function OGMetaTags({ title, subtitle }: OGMetaTagsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 space-y-3 md:space-y-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">HTML Meta Tags</h3>
      <div className="p-4 rounded-lg bg-gray-900 dark:bg-gray-950 border border-gray-700 dark:border-gray-600">
        <code className="text-sm text-green-400 font-mono leading-relaxed whitespace-pre-wrap">
          {`<meta property="og:image" content="/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${subtitle}" />`}
        </code>
      </div>
    </div>
  )
}
