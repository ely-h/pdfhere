interface DropzoneProps {
  accept: string
  multiple?: boolean
  onFiles: (files: File[]) => void
  label?: string
}

export function Dropzone({ accept, multiple = false, onFiles, label }: DropzoneProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiles(Array.from(e.target.files ?? []))
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    onFiles(Array.from(e.dataTransfer.files))
  }

  return (
    <label
      className="block border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-gray-400 transition-colors"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={handleChange}
      />
      <p className="text-gray-500 text-sm">{label ?? 'Glisser les fichiers ici ou cliquer pour choisir'}</p>
    </label>
  )
}
