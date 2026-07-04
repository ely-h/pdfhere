import { useState } from 'react'
import { ToolLayout } from '../../components/ToolLayout'
import { Dropzone } from '../../components/Dropzone'
import { PageGrid } from '../../components/PageGrid'
import { Spinner } from '../../components/Spinner'
import { ResultScreen } from '../../components/ResultScreen'
import { IconRotate, IconShieldCheck } from '../../components/Icons'
import { formatSize } from '../../lib/utils'

interface Result {
  blob: Blob
  pageCount: number
}

export default function RotatePdf() {
  const [file, setFile] = useState<File | null>(null)
  const [thumbnails, setThumbnails] = useState<string[]>([])
  const [loadingThumbs, setLoadingThumbs] = useState(false)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [rotations, setRotations] = useState<Map<number, number>>(new Map())
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (files: File[]) => {
    const f = files[0]
    if (!f) return
    setFile(f)
    setSelected(new Set())
    setRotations(new Map())
    setResult(null)
    setError(null)
    setThumbnails([])
    setLoadingThumbs(true)
    try {
      const { renderThumbnails } = await import('../../lib/render')
      setThumbnails(await renderThumbnails(f))
    } catch {
      setError('Impossible de lire ce fichier PDF.')
    } finally {
      setLoadingThumbs(false)
    }
  }

  const togglePage = (n: number) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(n) ? next.delete(n) : next.add(n)
      return next
    })

  const applyRotation = (delta: number) => {
    const targets =
      selected.size > 0 ? [...selected] : thumbnails.map((_, i) => i + 1)
    setRotations((prev) => {
      const next = new Map(prev)
      for (const n of targets) {
        const current = next.get(n) ?? 0
        next.set(n, (current + delta + 360) % 360)
      }
      return next
    })
  }

  const hasChanges = [...rotations.values()].some((v) => v !== 0)

  const handleApply = async () => {
    if (!file) return
    setError(null)
    setProcessing(true)
    try {
      const { rotatePdf } = await import('../../lib/pdf')
      const blob = await rotatePdf(file, rotations)
      setResult({ blob, pageCount: thumbnails.length })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.')
    } finally {
      setProcessing(false)
    }
  }

  const handleRedo = () => {
    setFile(null)
    setThumbnails([])
    setSelected(new Set())
    setRotations(new Map())
    setResult(null)
    setError(null)
  }

  if (result) {
    return (
      <ToolLayout title="Rotate PDF" subtitle="">
        <ResultScreen
          title="Rotation appliquée"
          description="Ton PDF a été pivoté localement. Aucune donnée envoyée."
          filename={file ? file.name.replace(/\.pdf$/i, '') + '-pivote.pdf' : 'document-pivote.pdf'}
          meta={`${result.pageCount} pages · ${formatSize(result.blob.size)}`}
          blob={result.blob}
          onRedo={handleRedo}
        />
      </ToolLayout>
    )
  }

  return (
    <ToolLayout title="Rotate PDF" subtitle="Clique les pages à pivoter, puis choisis l'angle.">
      {processing && <Spinner />}

      {!file && (
        <div className="tool-body">
          <Dropzone
            accept="application/pdf"
            onFiles={handleFile}
            title="Dépose ton PDF ici"
            subtitle="ou clique pour parcourir - rien n'est envoyé"
          />
        </div>
      )}

      {file && (
        <>
          <div className="ctrls">
            <div className="rot-controls">
              <button className="rot-btn" onClick={() => applyRotation(270)}>↺ 90°</button>
              <button className="rot-btn" onClick={() => applyRotation(90)}>↻ 90°</button>
              <button className="rot-btn" onClick={() => applyRotation(180)}>180°</button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {selected.size < thumbnails.length && (
                <button
                  className="rot-btn"
                  onClick={() => setSelected(new Set(thumbnails.map((_, i) => i + 1)))}
                >
                  Tout sélectionner
                </button>
              )}
              {selected.size > 0 && (
                <button className="rot-btn" onClick={() => setSelected(new Set())}>
                  Désélectionner
                </button>
              )}
            </div>
          </div>

          {selected.size === 0 && thumbnails.length > 0 && (
            <div className="tool-body" style={{ paddingTop: 4, paddingBottom: 0 }}>
              <div className="info-banner">
                Aucune sélection - la rotation s'applique à toutes les pages.
              </div>
            </div>
          )}

          <PageGrid
            thumbnails={thumbnails}
            selected={selected}
            onToggle={togglePage}
            rotations={rotations}
            loading={loadingThumbs}
          />

          <div className="tfoot">
            <div className="reassure">
              <IconShieldCheck size={14} />
              Miniatures rendues en local - aucune page envoyée.
            </div>
            {error && (
              <p style={{ fontSize: 12, color: 'var(--accent)', margin: 0 }}>{error}</p>
            )}
            <button
              className="btn-primary"
              style={{ padding: '14px 26px' }}
              disabled={!hasChanges}
              onClick={handleApply}
            >
              <IconRotate size={16} />
              Appliquer la rotation
            </button>
          </div>
        </>
      )}
    </ToolLayout>
  )
}
