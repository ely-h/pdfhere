import { useState } from 'react'
import { Link } from 'react-router-dom'
import { downloadBlob } from '../lib/download'
import { IconCheck, IconDownload } from './Icons'

interface ResultScreenProps {
  title: string
  description: string
  filename: string
  meta: string
  blob: Blob | null
  onRedo: () => void
}

export function ResultScreen({ title, description, filename, meta, blob, onRedo }: ResultScreenProps) {
  const [saved, setSaved] = useState(false)

  const handleDownload = () => {
    if (!blob) return
    downloadBlob(blob, filename)
    setSaved(true)
  }

  return (
    <div className="result">
      <div className="check-circle">
        <IconCheck />
      </div>
      <div className="rtitle">{title}</div>
      <div className="rtext">{description}</div>

      <div className="rsummary">
        <span className="fdoc"><span className="plines" /></span>
        <div>
          <div className="rsname">{filename}</div>
          <div className="rsmeta">{meta}</div>
        </div>
      </div>

      {blob && (
        <button
          className="btn-primary"
          style={{ padding: '15px 30px' }}
          onClick={handleDownload}
        >
          <IconDownload />
          {saved ? 'Enregistré ✓' : 'Télécharger'}
        </button>
      )}

      <div className="rlinks">
        <button className="rlink" onClick={onRedo}>Refaire</button>
        <Link to="/" className="rlink">Autre outil</Link>
      </div>
    </div>
  )
}
