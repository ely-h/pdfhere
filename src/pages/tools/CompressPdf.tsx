import { useState } from 'react'
import { ToolLayout } from '../../components/ToolLayout'
import { Dropzone } from '../../components/Dropzone'
import { Spinner } from '../../components/Spinner'
import { ResultScreen } from '../../components/ResultScreen'
import { IconArrowForward, IconCompress, IconShieldCheck } from '../../components/Icons'
import { formatSize } from '../../lib/utils'

interface Result {
  blob: Blob
  originalSize: number
}

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null)
  const [compress, setCompress] = useState(60)
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

  const qLabel =
    compress < 33 ? 'Qualité maximale' : compress < 70 ? 'Équilibré' : 'Compression forte'

  const handleCompress = async () => {
    if (!file) return
    setError(null)
    setProcessing(true)
    try {
      const { compressPdf } = await import('../../lib/pdf')
      const blob = await compressPdf(file, compress)
      setResult({ blob, originalSize: file.size })
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
    setCompress(60)
  }

  if (result) {
    const actualPct = Math.round((1 - result.blob.size / result.originalSize) * 100)
    return (
      <ToolLayout title="Compress PDF" subtitle="">
        <ResultScreen
          title="Compression terminée"
          description="Fichier optimisé directement dans ton navigateur. Rien n'a été téléversé."
          filename={file?.name.replace(/\.pdf$/i, '-compresse.pdf') ?? 'compresse.pdf'}
          meta={`${formatSize(result.blob.size)} · −${Math.max(0, actualPct)}%`}
          blob={result.blob}
          onRedo={handleRedo}
        />
      </ToolLayout>
    )
  }

  return (
    <ToolLayout title="Compress PDF" subtitle="Ajuste le curseur pour viser la bonne taille.">
      {processing && <Spinner />}

      <div className="cwrap">
        {!file ? (
          <Dropzone
            accept="application/pdf"
            onFiles={handleFile}
            title="Dépose ton PDF ici"
            subtitle="ou clique pour parcourir - rien n'est envoyé"
          />
        ) : (
          <>
            <div className="cbig">
              <div className="cbox">
                <div className="cboxlab">Original</div>
                <div className="cval">{formatSize(file.size)}</div>
              </div>
              <div className="carrow">
                <IconArrowForward />
              </div>
              <div className="cbox cbox-out">
                <div className="cboxlab">Résultat</div>
                <div className="cval cval-small">Selon les images du PDF</div>
              </div>
            </div>

            <div className="sliderwrap">
              <div className="slabel">
                <span className="qlabel">{qLabel}</span>
              </div>
              <div className="srange">
                <div className="strack">
                  <div className="sfill" style={{ width: `${compress}%` }} />
                </div>
                <input
                  type="range"
                  className="sinput"
                  min={0}
                  max={100}
                  value={compress}
                  onChange={(e) => setCompress(Number(e.target.value))}
                />
              </div>
              <div className="sscale">
                <span>qualité max</span>
                <span>taille mini</span>
              </div>
            </div>

            <button
              className="btn-primary btn-primary-full"
              style={{ marginTop: 18 }}
              onClick={handleCompress}
            >
              <IconCompress size={18} />
              Compresser le PDF
            </button>

            <div className="compress-warn">
              Seules les images déjà présentes dans le PDF sont recompressées. Le texte reste
              intact et sélectionnable. Un PDF sans image gagnera peu.
            </div>

            {error && (
              <p style={{ fontSize: 12, color: 'var(--accent)', marginTop: 12 }}>{error}</p>
            )}

            <div className="reassure" style={{ marginTop: 14 }}>
              <IconShieldCheck size={14} />
              Compression effectuée dans ton navigateur, image par image.
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  )
}
