import { useState } from 'react'
import { ToolLayout } from '../../components/ToolLayout'
import { Dropzone } from '../../components/Dropzone'
import { PageGrid } from '../../components/PageGrid'
import { Spinner } from '../../components/Spinner'
import { ResultScreen } from '../../components/ResultScreen'
import { IconDelete, IconShieldCheck } from '../../components/Icons'
import { formatSize } from '../../lib/utils'

interface Result {
  blob: Blob
  remainingPages: number
}

export default function DeletePages() {
  const [file, setFile] = useState<File | null>(null)
  const [thumbnails, setThumbnails] = useState<string[]>([])
  const [loadingThumbs, setLoadingThumbs] = useState(false)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (files: File[]) => {
    const f = files[0]
    if (!f) return
    setFile(f)
    setSelected(new Set())
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

  const sorted = [...selected].sort((a, b) => a - b)
  const remaining = thumbnails.length - selected.size
  const canDelete = selected.size > 0 && remaining > 0

  const handleDelete = async () => {
    if (!file || !canDelete) return
    setError(null)
    setProcessing(true)
    try {
      const { deletePages } = await import('../../lib/pdf')
      const blob = await deletePages(file, sorted)
      setResult({ blob, remainingPages: remaining })
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
    setResult(null)
    setError(null)
  }

  if (result) {
    return (
      <ToolLayout title="Delete pages" subtitle="">
        <ResultScreen
          title="Pages supprimées"
          description="Ton PDF a été modifié localement. Aucune donnée envoyée."
          filename={file ? file.name.replace(/\.pdf$/i, '') + '-modifie.pdf' : 'document-modifie.pdf'}
          meta={`${result.remainingPages} pages · ${formatSize(result.blob.size)}`}
          blob={result.blob}
          onRedo={handleRedo}
        />
      </ToolLayout>
    )
  }

  return (
    <ToolLayout title="Delete pages" subtitle="Clique les pages à supprimer.">
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
            <span className="rangepill">
              {selected.size === 0
                ? 'Aucune page sélectionnée'
                : `${selected.size} page${selected.size > 1 ? 's' : ''} à supprimer`}
            </span>
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

          {selected.size === thumbnails.length && thumbnails.length > 0 && (
            <div className="tool-body" style={{ paddingTop: 4, paddingBottom: 0 }}>
              <div className="info-banner" style={{ color: 'var(--accent)' }}>
                Impossible de supprimer toutes les pages - garde au moins une.
              </div>
            </div>
          )}

          <PageGrid
            thumbnails={thumbnails}
            selected={selected}
            onToggle={togglePage}
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
              disabled={!canDelete}
              onClick={handleDelete}
            >
              <IconDelete size={16} />
              {selected.size > 0
                ? `Supprimer ${selected.size} page${selected.size > 1 ? 's' : ''}`
                : 'Supprimer les pages'}
            </button>
          </div>
        </>
      )}
    </ToolLayout>
  )
}
