import { useRef, useState } from 'react'
import { ToolLayout } from '../../components/ToolLayout'
import { Dropzone } from '../../components/Dropzone'
import { Spinner } from '../../components/Spinner'
import { ResultScreen } from '../../components/ResultScreen'
import { IconDragHandle, IconX, IconShieldCheck, IconMerge } from '../../components/Icons'
import { formatSize } from '../../lib/utils'

interface Entry {
  id: number
  file: File
  pageCount: number | null
}

interface Result {
  blob: Blob
  pages: number
}

export default function MergePdf() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [dragId, setDragId] = useState<number | null>(null)
  const [overId, setOverId] = useState<number | null>(null)
  const [keepBookmarks, setKeepBookmarks] = useState(true)
  const [flatten, setFlatten] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const nextId = useRef(0)

  const addFiles = async (files: File[]) => {
    const pdfs = files.filter((f) => f.type === 'application/pdf' || f.name.endsWith('.pdf'))
    if (pdfs.length === 0) return
    const added: Entry[] = pdfs.map((f) => ({ id: nextId.current++, file: f, pageCount: null }))
    setEntries((prev) => [...prev, ...added])

    const { getPageCount } = await import('../../lib/pdf')
    for (const entry of added) {
      getPageCount(entry.file)
        .then((count) =>
          setEntries((prev) =>
            prev.map((e) => (e.id === entry.id ? { ...e, pageCount: count } : e)),
          ),
        )
        .catch(() => {})
    }
  }

  const removeEntry = (id: number) => setEntries((prev) => prev.filter((e) => e.id !== id))

  const onDragStart = (id: number) => setDragId(id)
  const onDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault()
    if (overId !== id) setOverId(id)
  }
  const onDrop = (targetId: number) => {
    if (dragId === null || dragId === targetId) {
      setDragId(null)
      setOverId(null)
      return
    }
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
  const onDragEnd = () => {
    setDragId(null)
    setOverId(null)
  }

  const totalPages = entries.reduce((s, e) => s + (e.pageCount ?? 0), 0)
  const canMerge = entries.length >= 2

  const handleMerge = async () => {
    setError(null)
    setProcessing(true)
    try {
      const { mergePdfs } = await import('../../lib/pdf')
      const blob = await mergePdfs(entries.map((e) => e.file), { keepBookmarks, flatten })
      setResult({ blob, pages: totalPages })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.')
    } finally {
      setProcessing(false)
    }
  }

  const handleRedo = () => {
    setResult(null)
    setEntries([])
    setError(null)
  }

  if (result) {
    return (
      <ToolLayout title="Merge PDF" subtitle="">
        <ResultScreen
          title="Fusion terminée"
          description="Ton PDF est prêt — assemblé entièrement sur ton appareil. Aucune donnée n'a quitté ton navigateur."
          filename="document-fusionne.pdf"
          meta={`${result.pages} pages · ${formatSize(result.blob.size)}`}
          blob={result.blob}
          onRedo={handleRedo}
        />
      </ToolLayout>
    )
  }

  return (
    <ToolLayout title="Merge PDF" subtitle="Glisse les fichiers pour les réordonner.">
      {processing && <Spinner />}

      <div className="mwrap">
        <div className="mcol">
          <Dropzone
            accept="application/pdf"
            multiple
            onFiles={addFiles}
            title="Dépose tes PDF ici"
            subtitle="ou clique pour parcourir — rien n'est envoyé"
          />

          {entries.length > 0 && (
            <>
              <div className="plabel" style={{ marginTop: 16 }}>
                {entries.length} fichier{entries.length > 1 ? 's' : ''} · ordre réglable
              </div>
              <div className="flist">
                {entries.map((entry, i) => {
                  const rowCls = [
                    'frow',
                    dragId === entry.id ? 'drag' : '',
                    overId === entry.id && dragId !== entry.id ? 'over' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')

                  const meta = entry.pageCount !== null
                    ? `${entry.pageCount} page${entry.pageCount > 1 ? 's' : ''} · ${formatSize(entry.file.size)}`
                    : `PDF · ${formatSize(entry.file.size)}`

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
                      <span className="fdoc"><span className="plines" /></span>
                      <span className="finfo">
                        <span className="fname">{entry.file.name}</span>
                        <span className="fmeta">{meta}</span>
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
              Aucun fichier. Ajoute au moins deux PDF pour fusionner.
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
            <div className="opt">
              <span>Conserver les signets</span>
              <button
                className={keepBookmarks ? 'tg on' : 'tg'}
                onClick={() => setKeepBookmarks((v) => !v)}
                aria-pressed={keepBookmarks}
              >
                <span className="knob" />
              </button>
            </div>
            <div className="opt opt-last">
              <span>Aplatir les formulaires</span>
              <button
                className={flatten ? 'tg on' : 'tg'}
                onClick={() => setFlatten((v) => !v)}
                aria-pressed={flatten}
              >
                <span className="knob" />
              </button>
            </div>
          </div>

          <button
            className="btn-primary btn-primary-full"
            style={{ marginTop: 16 }}
            disabled={!canMerge}
            onClick={handleMerge}
          >
            <IconMerge size={18} />
            Fusionner{totalPages > 0 ? ` — ${totalPages} pages` : ''}
          </button>

          <button
            className="btn-ghost"
            style={{ marginTop: 10 }}
            onClick={handleRedo}
          >
            Annuler
          </button>

          {error && (
            <p style={{ fontSize: 12, color: 'var(--accent)', marginTop: 12 }}>{error}</p>
          )}

          <div className="reassure" style={{ marginTop: 16 }}>
            <IconShieldCheck size={14} />
            Fusion calculée sur ton appareil. Rien n'est envoyé.
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
