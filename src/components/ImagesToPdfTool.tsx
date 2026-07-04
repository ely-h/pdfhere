import { useRef, useState } from 'react'
import { ToolLayout } from './ToolLayout'
import { Dropzone } from './Dropzone'
import { Spinner } from './Spinner'
import { ResultScreen } from './ResultScreen'
import { IconDragHandle, IconImgToPdf, IconShieldCheck, IconX } from './Icons'
import { formatSize } from '../lib/utils'

interface ImageEntry {
  id: number
  file: File
  preview: string
}

interface Result {
  blob: Blob
  count: number
}

interface ImagesToPdfToolProps {
  accept: string
  title: string
  subtitle: string
  label: string
}

export function ImagesToPdfTool({ accept, title, subtitle, label }: ImagesToPdfToolProps) {
  const [entries, setEntries] = useState<ImageEntry[]>([])
  const [dragId, setDragId] = useState<number | null>(null)
  const [overId, setOverId] = useState<number | null>(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const nextId = useRef(0)

  const addFiles = (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith('image/'))
    if (images.length === 0) return
    const added: ImageEntry[] = images.map((f) => ({
      id: nextId.current++,
      file: f,
      preview: URL.createObjectURL(f),
    }))
    setEntries((prev) => [...prev, ...added])
  }

  const removeEntry = (id: number) => {
    setEntries((prev) => {
      const entry = prev.find((e) => e.id === id)
      if (entry) URL.revokeObjectURL(entry.preview)
      return prev.filter((e) => e.id !== id)
    })
  }

  const onDragStart = (id: number) => setDragId(id)
  const onDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault()
    if (overId !== id) setOverId(id)
  }
  const onDrop = (targetId: number) => {
    if (dragId === null || dragId === targetId) { setDragId(null); setOverId(null); return }
    setEntries((prev) => {
      const arr = [...prev]
      const from = arr.findIndex((e) => e.id === dragId)
      const to = arr.findIndex((e) => e.id === targetId)
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return arr
    })
    setDragId(null)
    setOverId(null)
  }
  const onDragEnd = () => { setDragId(null); setOverId(null) }

  const handleConvert = async () => {
    if (entries.length === 0) return
    setError(null)
    setProcessing(true)
    try {
      const { imagesToPdf } = await import('../lib/pdf')
      const blob = await imagesToPdf(entries.map((e) => e.file))
      setResult({ blob, count: entries.length })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.')
    } finally {
      setProcessing(false)
    }
  }

  const handleRedo = () => {
    entries.forEach((e) => URL.revokeObjectURL(e.preview))
    setEntries([])
    setResult(null)
    setError(null)
  }

  if (result) {
    return (
      <ToolLayout title={title} subtitle="">
        <ResultScreen
          title="PDF créé"
          description={`Tes ${result.count} image${result.count > 1 ? 's' : ''} ont été assemblées en PDF localement.`}
          filename={`images-${label.toLowerCase()}.pdf`}
          meta={`${result.count} image${result.count > 1 ? 's' : ''} · ${formatSize(result.blob.size)}`}
          blob={result.blob}
          onRedo={handleRedo}
        />
      </ToolLayout>
    )
  }

  return (
    <ToolLayout title={title} subtitle={subtitle}>
      {processing && <Spinner />}

      <div className="mwrap">
        <div className="mcol">
          <Dropzone
            accept={accept}
            multiple
            onFiles={addFiles}
            title={`Dépose tes images ${label} ici`}
            subtitle="ou clique pour parcourir - rien n'est envoyé"
          />

          {entries.length > 0 && (
            <>
              <div className="plabel" style={{ marginTop: 16 }}>
                {entries.length} image{entries.length > 1 ? 's' : ''} · ordre réglable
              </div>
              <div className="flist">
                {entries.map((entry, i) => {
                  const rowCls = [
                    'frow',
                    dragId === entry.id ? 'drag' : '',
                    overId === entry.id && dragId !== entry.id ? 'over' : '',
                  ].filter(Boolean).join(' ')

                  return (
                    <div
                      key={entry.id}
                      className={rowCls}
                      draggable
                      onDragStart={() => onDragStart(entry.id)}
                      onDragOver={(e) => onDragOver(e, entry.id)}
                      onDrop={() => onDrop(entry.id)}
                      onDragEnd={onDragEnd}
                    >
                      <span className="fnum">{i + 1}</span>
                      <span className="handle"><IconDragHandle /></span>
                      <img className="fimg-thumb" src={entry.preview} alt={entry.file.name} />
                      <span className="finfo">
                        <span className="fname">{entry.file.name}</span>
                        <span className="fmeta">{formatSize(entry.file.size)}</span>
                      </span>
                      <button
                        className="fclose"
                        onClick={() => removeEntry(entry.id)}
                        aria-label="Supprimer"
                      >
                        <IconX />
                      </button>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {entries.length === 0 && (
            <div className="empty" style={{ marginTop: 16 }}>
              Aucune image. Ajoute des fichiers {label} pour créer un PDF.
            </div>
          )}
        </div>

        <div className="side">
          <div className="panel">
            <div className="ptitle">Options</div>
            <div className="opt">
              <span>Ordre des pages</span>
              <span className="badge">Glisser-déposer</span>
            </div>
            <div className="opt opt-last">
              <span>Format</span>
              <span className="badge">Taille image</span>
            </div>
          </div>

          <button
            className="btn-primary btn-primary-full"
            style={{ marginTop: 16 }}
            disabled={entries.length === 0}
            onClick={handleConvert}
          >
            <IconImgToPdf size={18} />
            Convertir en PDF{entries.length > 0 ? ` - ${entries.length} image${entries.length > 1 ? 's' : ''}` : ''}
          </button>

          <button className="btn-ghost" style={{ marginTop: 10 }} onClick={handleRedo}>
            Annuler
          </button>

          {error && <p style={{ fontSize: 12, color: 'var(--accent)', marginTop: 12 }}>{error}</p>}

          <div className="reassure" style={{ marginTop: 16 }}>
            <IconShieldCheck size={14} />
            Conversion sur ton appareil. Rien n'est envoyé.
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
