import { useState } from 'react'
import { ToolLayout } from '../../components/ToolLayout'
import { Dropzone } from '../../components/Dropzone'
import { Spinner } from '../../components/Spinner'
import { ResultScreen } from '../../components/ResultScreen'
import { IconShieldCheck } from '../../components/Icons'
import { formatSize } from '../../lib/utils'
import { downloadBlob } from '../../lib/download'

type SplitMode = 'range' | 'burst'

interface Result {
  blob: Blob | null
  filename: string
  meta: string
}

function isContiguous(nums: number[]): boolean {
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1] + 1) return false
  }
  return true
}

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null)
  const [thumbnails, setThumbnails] = useState<string[]>([])
  const [loadingThumbs, setLoadingThumbs] = useState(false)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [splitMode, setSplitMode] = useState<SplitMode>('range')
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

  let rangeLabel = 'Aucune page'
  if (sorted.length > 0) {
    if (splitMode === 'burst') {
      rangeLabel = 'Éclatement'
    } else if (isContiguous(sorted)) {
      rangeLabel = `Pages ${sorted[0]} – ${sorted[sorted.length - 1]}`
    } else {
      rangeLabel = `${sorted.length} pages`
    }
  }

  const extractLabel =
    splitMode === 'burst'
      ? `Créer ${sorted.length} fichier${sorted.length > 1 ? 's' : ''}`
      : `Extraire ${sorted.length} page${sorted.length > 1 ? 's' : ''}`

  const handleAction = async () => {
    if (!file || sorted.length === 0) return
    setError(null)
    setProcessing(true)
    try {
      const baseName = file.name.replace(/\.pdf$/i, '')

      if (splitMode === 'range') {
        const { extractPages } = await import('../../lib/pdf')
        const blob = await extractPages(file, sorted)
        setResult({
          blob,
          filename: `${baseName}-extrait.pdf`,
          meta: `${sorted.length} page${sorted.length > 1 ? 's' : ''} · ${formatSize(blob.size)}`,
        })
      } else {
        const { splitBurst } = await import('../../lib/pdf')
        const blobs = await splitBurst(file, sorted)
        blobs.forEach((b, i) => {
          setTimeout(() => downloadBlob(b, `${baseName}-page-${sorted[i]}.pdf`), i * 80)
        })
        setResult({
          blob: null,
          filename: `${blobs.length} fichiers PDF`,
          meta: `${blobs.length} page${blobs.length > 1 ? 's' : ''} séparée${blobs.length > 1 ? 's' : ''}`,
        })
      }
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
    const isBurst = result.blob === null
    return (
      <ToolLayout title="Split PDF" subtitle="">
        <ResultScreen
          title={isBurst ? 'Éclatement terminé' : 'Extraction terminée'}
          description={
            isBurst
              ? 'Tes fichiers ont été téléchargés directement dans ton dossier de téléchargements.'
              : 'Tes pages sont prêtes — extraites localement, sans aucun envoi.'
          }
          filename={result.filename}
          meta={result.meta}
          blob={result.blob}
          onRedo={handleRedo}
        />
      </ToolLayout>
    )
  }

  return (
    <ToolLayout title="Split PDF" subtitle="Clique les pages à extraire.">
      {processing && <Spinner />}

      {!file && (
        <div className="tool-body">
          <Dropzone
            accept="application/pdf"
            onFiles={handleFile}
            title="Dépose ton PDF ici"
            subtitle="ou clique pour parcourir — rien n'est envoyé"
          />
        </div>
      )}

      {file && (
        <>
          <div className="ctrls">
            <span className="rangepill">{rangeLabel} · {sorted.length} page{sorted.length !== 1 ? 's' : ''}</span>
            <div className="seg">
              <button
                className={splitMode === 'range' ? 'si on' : 'si'}
                onClick={() => setSplitMode('range')}
              >
                Extraire la sélection
              </button>
              <button
                className={splitMode === 'burst' ? 'si on' : 'si'}
                onClick={() => setSplitMode('burst')}
              >
                Éclater en fichiers
              </button>
            </div>
          </div>

          <div className="tgrid">
            {loadingThumbs
              ? Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="thumb" style={{ background: 'var(--surf2)' }} />
                ))
              : thumbnails.map((src, i) => {
                  const n = i + 1
                  const isSel = selected.has(n)
                  return (
                    <div
                      key={n}
                      className={isSel ? 'thumb sel' : 'thumb'}
                      onClick={() => togglePage(n)}
                    >
                      <img className="thumb-img" src={src} alt={`Page ${n}`} />
                      <span className="tcheck">
                        <svg className="ic" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                          <polyline points="5,13 10,18 19,6" />
                        </svg>
                      </span>
                      <span className="pnum">{n}</span>
                    </div>
                  )
                })}
          </div>

          <div className="tfoot">
            <div className="reassure">
              <IconShieldCheck size={14} />
              Miniatures rendues par ton navigateur — aucune page envoyée.
            </div>
            {error && <p style={{ fontSize: 12, color: 'var(--accent)', margin: 0 }}>{error}</p>}
            <button
              className="btn-primary"
              style={{ padding: '14px 26px' }}
              disabled={sorted.length === 0}
              onClick={handleAction}
            >
              {extractLabel}
            </button>
          </div>
        </>
      )}
    </ToolLayout>
  )
}
