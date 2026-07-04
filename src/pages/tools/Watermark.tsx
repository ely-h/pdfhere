import { useState } from 'react'
import { ToolLayout } from '../../components/ToolLayout'
import { Dropzone } from '../../components/Dropzone'
import { Spinner } from '../../components/Spinner'
import { ResultScreen } from '../../components/ResultScreen'
import { IconWatermark, IconShieldCheck } from '../../components/Icons'
import { formatSize } from '../../lib/utils'

interface Result {
  blob: Blob
  pageCount: number
}

export default function Watermark() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('CONFIDENTIEL')
  const [opacity, setOpacity] = useState(25)
  const [angle, setAngle] = useState(45)
  const [fontSize, setFontSize] = useState(60)
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
    if (!file || text.trim() === '') return
    setError(null)
    setProcessing(true)
    try {
      const { addWatermark, getPageCount } = await import('../../lib/pdf')
      const blob = await addWatermark(file, {
        text: text.trim(),
        opacity: opacity / 100,
        angle,
        fontSize,
      })
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
      <ToolLayout title="Watermark" subtitle="">
        <ResultScreen
          title="Filigrane ajouté"
          description="Le filigrane a été appliqué localement. Aucune donnée envoyée."
          filename={file ? file.name.replace(/\.pdf$/i, '') + '-filigrane.pdf' : 'document-filigrane.pdf'}
          meta={`${result.pageCount} pages · ${formatSize(result.blob.size)}`}
          blob={result.blob}
          onRedo={handleRedo}
        />
      </ToolLayout>
    )
  }

  return (
    <ToolLayout title="Watermark" subtitle="Ajoute un texte en filigrane sur toutes les pages.">
      {processing && <Spinner />}

      <div className="mwrap">
        <div className="mcol">
          <Dropzone
            accept="application/pdf"
            onFiles={handleFile}
            title="Dépose ton PDF ici"
            subtitle="ou clique pour parcourir - rien n'est envoyé"
          />

          {file && (
            <div className="info-banner" style={{ marginTop: 16 }}>
              Filigrane appliqué sur toutes les pages au centre, avec la rotation choisie.
            </div>
          )}
        </div>

        <div className="side">
          <div className="panel">
            <div className="ptitle">Options</div>

            <div className="opt" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ fontWeight: 700 }}>Texte</span>
              <input
                className="field-input"
                type="text"
                placeholder="CONFIDENTIEL"
                value={text}
                maxLength={40}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div className="opt" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ fontWeight: 700 }}>Opacité</span>
                <span className="badge">{opacity}%</span>
              </div>
              <div className="srange" style={{ width: '100%' }}>
                <div className="strack">
                  <div className="sfill" style={{ width: `${opacity}%` }} />
                </div>
                <input
                  className="sinput"
                  type="range"
                  min={5}
                  max={80}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="opt" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ fontWeight: 700 }}>Angle</span>
                <span className="badge">{angle}°</span>
              </div>
              <div className="srange" style={{ width: '100%' }}>
                <div className="strack">
                  <div className="sfill" style={{ width: `${(angle / 90) * 100}%` }} />
                </div>
                <input
                  className="sinput"
                  type="range"
                  min={0}
                  max={90}
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="opt opt-last" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ fontWeight: 700 }}>Taille</span>
                <span className="badge">{fontSize} pt</span>
              </div>
              <div className="srange" style={{ width: '100%' }}>
                <div className="strack">
                  <div className="sfill" style={{ width: `${((fontSize - 20) / 100) * 100}%` }} />
                </div>
                <input
                  className="sinput"
                  type="range"
                  min={20}
                  max={120}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <button
            className="btn-primary btn-primary-full"
            style={{ marginTop: 16 }}
            disabled={!file || text.trim() === ''}
            onClick={handleAdd}
          >
            <IconWatermark size={18} />
            Ajouter le filigrane
          </button>

          {error && <p style={{ fontSize: 12, color: 'var(--accent)', marginTop: 12 }}>{error}</p>}

          <div className="reassure" style={{ marginTop: 16 }}>
            <IconShieldCheck size={14} />
            Filigrane calculé sur ton appareil. Rien n'est envoyé.
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
