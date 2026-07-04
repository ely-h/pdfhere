import { useState } from 'react'
import { ToolLayout } from '../../components/ToolLayout'
import { Dropzone } from '../../components/Dropzone'
import { Spinner } from '../../components/Spinner'
import { ResultScreen } from '../../components/ResultScreen'
import { IconPdfToImg, IconShieldCheck } from '../../components/Icons'
import { formatSize } from '../../lib/utils'

interface Result {
  blob: Blob
  pageCount: number
}

export default function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState(85)
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

  const handleExport = async () => {
    if (!file) return
    setError(null)
    setProcessing(true)
    try {
      const { renderToJpegs } = await import('../../lib/render')
      const blobs = await renderToJpegs(file, quality / 100)

      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      const baseName = file.name.replace(/\.pdf$/i, '')
      blobs.forEach((blob, i) => {
        zip.file(`${baseName}-page-${String(i + 1).padStart(3, '0')}.jpg`, blob)
      })
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      setResult({ blob: zipBlob, pageCount: blobs.length })
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

  const savedPct = Math.round((1 - quality / 100) * 30 + 70)

  if (result) {
    return (
      <ToolLayout title="PDF to JPG" subtitle="">
        <ResultScreen
          title="Export terminé"
          description={`${result.pageCount} image${result.pageCount > 1 ? 's' : ''} exportée${result.pageCount > 1 ? 's' : ''} en local - aucune donnée envoyée.`}
          filename={file ? file.name.replace(/\.pdf$/i, '') + '-pages.zip' : 'pages.zip'}
          meta={`${result.pageCount} JPEG · ${formatSize(result.blob.size)}`}
          blob={result.blob}
          onRedo={handleRedo}
        />
      </ToolLayout>
    )
  }

  return (
    <ToolLayout title="PDF to JPG" subtitle="Exporte chaque page en JPEG, téléchargées dans un zip.">
      {processing && <Spinner />}

      <div className="cwrap">
        <Dropzone
          accept="application/pdf"
          onFiles={handleFile}
          title="Dépose ton PDF ici"
          subtitle="ou clique pour parcourir - rien n'est envoyé"
        />

        {file && (
          <>
            <div style={{ marginTop: 20 }}>
              <div className="sliderwrap">
                <div className="slabel">
                  <span className="qlabel">Qualité JPEG</span>
                  <span className="savedtag">{quality}%</span>
                </div>
                <div className="srange">
                  <div className="strack">
                    <div className="sfill" style={{ width: `${quality}%` }} />
                  </div>
                  <input
                    className="sinput"
                    type="range"
                    min={30}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                  />
                </div>
                <div className="sscale">
                  <span>30 - économe</span>
                  <span>100 - meilleure qualité</span>
                </div>
              </div>
            </div>

            <div className="info-banner" style={{ marginTop: 14 }}>
              Chaque page est rendue en JPEG à résolution 2x ({savedPct > 85 ? 'haute qualité' : 'bonne qualité'}), puis regroupée dans un zip.
            </div>

            {error && <p style={{ fontSize: 12, color: 'var(--accent)', marginTop: 12 }}>{error}</p>}

            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
              <button className="btn-primary" onClick={handleExport}>
                <IconPdfToImg size={18} />
                Exporter en JPEG
              </button>
              <div className="reassure">
                <IconShieldCheck size={14} />
                Rendu dans ton navigateur. Aucun upload.
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  )
}
