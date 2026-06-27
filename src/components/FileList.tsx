interface FileListProps {
  files: File[]
  onRemove?: (index: number) => void
}

export function FileList({ files, onRemove }: FileListProps) {
  if (files.length === 0) return null
  return (
    <ul className="space-y-2">
      {files.map((file, i) => (
        <li
          key={i}
          className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 border border-gray-100 shadow-sm"
        >
          <span className="text-sm text-gray-700 truncate">{file.name}</span>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="ml-3 text-gray-400 hover:text-gray-700 text-xs shrink-0"
            >
              Supprimer
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}
