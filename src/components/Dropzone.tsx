import { useState } from 'react'
import { IconUpload } from './Icons'

interface DropzoneProps {
  accept: string
  multiple?: boolean
  onFiles: (files: File[]) => void
  title?: string
  subtitle?: string
}

export function Dropzone({
  accept,
  multiple = false,
  onFiles,
  title = 'Dépose tes fichiers ici',
  subtitle = 'ou clique pour parcourir - rien n\'est envoyé',
}: DropzoneProps) {
  const [over, setOver] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiles(Array.from(e.target.files ?? []))
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setOver(false)
    onFiles(Array.from(e.dataTransfer.files))
  }

  return (
    <label
      className={over ? 'dz dz-over' : 'dz'}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <span className="dz-ic">
        <IconUpload />
      </span>
      <span>
        <span className="dz-title">{title}</span>
        <span className="dz-sub">{subtitle}</span>
      </span>
    </label>
  )
}
