import { useState } from 'react'
import { ToolLayout } from '../../components/ToolLayout'
import { Dropzone } from '../../components/Dropzone'
import { Spinner } from '../../components/Spinner'
import { ResultScreen } from '../../components/ResultScreen'
import { IconPageNumbers, IconShieldCheck } from '../../components/Icons'
import { formatSize } from '../../lib/utils'

type Position =
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'

type Format = 'arabic' | 'roman-lower' | 'roman-upper'

const POSITIONS: { id: Position; label: string }[] = [
  { id: 'top-left', label: '↖ Haut G' },
  { id: 'top-center', label: '↑ Haut C' },
  { id: 'top-right', label: '↗ Haut D' },
  { id: 'bottom-left', label: '↙ Bas G' },
  { id: 'bottom-center', label: '↓ Bas C' },
  { id: 'bottom-right', label: '↘ Bas D' },
]

const FORMATS: { id: Format; label: string; example: string }[] = [
  { id: 'arabic', label: 'Arabe', example: '1 2 3' },
  { id: 'roman-lower', label: 'Romain min.', example: 'i ii iii' },
  { id: 'roman-upper', label: 'Romain maj.', example: 'I II III' },
]

interface Result {
  blob: Blob
  pageCount: number
}

export default function PageNumbers() {
  const [file, setFile] = useState<File | null>(null)
  const [position, setPosition] = useState<Position>('bottom-center')
  const [startAt, setStartAt] = useState(1)
  const [fontSize, setFontSize] = useState(11)
  const [format, setFormat] = useState<Format>('arabic')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = (files: File[]) => {
    const f = files[0]
    if (!f) return
    setFile(f)
    setResult(null)
    setError(null)
  }

  const handleAdd = async () => {
    if (!file) return
    setError(null)
    setProcessing(true)
    try {
      const { addPageNumbers } = await import('../../lib/pdf')
      const blob = await addPageNumbers(file, { position, startAt, fontSize, format })
      const { getPageCount } = await import('../../lib/pdf')
      const pageCount = await getPageCount(file)
      setResult({ blob, pageCount })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.')
    } finally {
      setProcessing(false)
    }
  }

  const handleRedo = () => {
    setFile(null)
    setResult(null)
    setError(null)
  }

  if (result) {
    return (
      <ToolLayout title="Page numbers" subtitle="">
        <ResultScreen
          title="Numéros ajoutés"
          description="Les numéros de page ont été insérés localement. Aucune donnée envoyée."
          filename={file ? file.name.replace(/\.pdf$/i, '') + '-numerote.pdf' : 'document-numerote.pdf'}
          meta={`${result.pageCount} pages · ${formatSize(result.blob.size)}`}
          blob={result.blob}
          onRedo={handleRedo}
        />
      </ToolLayout>
    )
  }

  return (
    <ToolLayout title="Page numbers" subtitle="Configure la position et le format des numéros.">
      {processing && <Spinner />}

      <div className="mwrap">
        <div className="mcol">
          <Dropzone
            accept="application/pdf"
            onFiles={handleFile}
            title="Dépose ton PDF ici"
            subtitle="ou clique pour parcourir - rien n'est envoyé"
          />
        </div>

        <div className="side">
          <div className="panel">
            <div className="ptitle">Options</div>

            <div className="opt" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ fontWeight: 700 }}>Position</span>
              <div className="pos-grid" style={{ width: '100%' }}>
                {POSITIONS.map((p) => (
                  <button
                    key={p.id}
                    className={position === p.id ? 'pos-btn on' : 'pos-btn'}
                    onClick={() => setPosition(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="opt" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ fontWeight: 700 }}>Format</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                {FORMATS.map((f) => (
                  <button
                    key={f.id}
                    className={format === f.id ? 'pos-btn on' : 'pos-btn'}
                    style={{ textAlign: 'left', padding: '8px 12px', display: 'flex', justifyContent: 'space-between' }}
                    onClick={() => setFormat(f.id)}
                  >
                    <span>{f.label}</span>
                    <span style={{ fontFamily: 'Space Mono, monospace', opacity: 0.7 }}>{f.example}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="opt" style={{ gap: 8 }}>
              <span>Commencer à</span>
              <input
                className="field-input"
                type="number"
                min={1}
                max={999}
                value={startAt}
                onChange={(e) => setStartAt(Math.max(1, Number(e.target.value)))}
                style={{ width: 70, textAlign: 'center' }}
              />
            </div>

            <div className="opt opt-last" style={{ gap: 8 }}>
              <span>Taille (pt)</span>
              <input
                className="field-input"
                type="number"
                min={7}
                max={24}
                value={fontSize}
                onChange={(e) => setFontSize(Math.min(24, Math.max(7, Number(e.target.value))))}
                style={{ width: 70, textAlign: 'center' }}
              />
            </div>
          </div>

          <button
            className="btn-primary btn-primary-full"
            style={{ marginTop: 16 }}
            disabled={!file}
            onClick={handleAdd}
          >
            <IconPageNumbers size={18} />
            Ajouter les numéros
          </button>

          {error && <p style={{ fontSize: 12, color: 'var(--accent)', marginTop: 12 }}>{error}</p>}

          <div className="reassure" style={{ marginTop: 16 }}>
            <IconShieldCheck size={14} />
            Numérotation calculée sur ton appareil. Rien n'est envoyé.
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
