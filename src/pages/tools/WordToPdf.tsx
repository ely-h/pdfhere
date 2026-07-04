import { useState } from 'react'
import { ToolLayout } from '../../components/ToolLayout'
import { Dropzone } from '../../components/Dropzone'
import { Spinner } from '../../components/Spinner'
import { IconShieldCheck, IconWordToPdf } from '../../components/Icons'

export default function WordToPdf() {
  const [file, setFile] = useState<File | null>(null)
  const [html, setHtml] = useState<string | null>(null)
  const [hasWarnings, setHasWarnings] = useState(false)
  const [converting, setConverting] = useState(false)
  const [popupBlocked, setPopupBlocked] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (files: File[]) => {
    const f = files[0]
    if (!f) return
    setFile(f)
    setHtml(null)
    setError(null)
    setPopupBlocked(false)
    setConverting(true)
    try {
      const { docxToHtml } = await import('../../lib/word')
      const result = await docxToHtml(f)
      setHtml(result.html)
      setHasWarnings(result.hasWarnings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de lire ce fichier.')
    } finally {
      setConverting(false)
    }
  }

  const handleExport = async () => {
    if (!html || !file) return
    setPopupBlocked(false)
    const { openPrintWindow } = await import('../../lib/word')
    const ok = openPrintWindow(html, file.name.replace(/\.docx$/i, ''))
    if (!ok) setPopupBlocked(true)
  }

  const handleRedo = () => {
    setFile(null)
    setHtml(null)
    setError(null)
    setHasWarnings(false)
    setPopupBlocked(false)
  }

  return (
    <ToolLayout title="Word to PDF" subtitle="Conversion .docx en PDF via ton navigateur.">
      {converting && <Spinner />}

      <div className="tool-body">
        <div className="warn-banner">
          <strong>Rendu indicatif.</strong> mammoth extrait le texte et la structure du .docx et les convertit en HTML. Le résultat est bon sur les documents simples (texte, titres, listes, tableaux basiques). Les mises en page complexes, les colonnes, les zones de texte et les objets incorporés ne sont pas reproduits fidèlement.
        </div>

        {!file && (
          <div style={{ marginTop: 18 }}>
            <Dropzone
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onFiles={handleFile}
              title="Dépose ton fichier .docx ici"
              subtitle="ou clique pour parcourir - rien n'est envoyé"
            />
          </div>
        )}

        {error && (
          <p style={{ fontSize: 13, color: 'var(--accent)', marginTop: 14 }}>{error}</p>
        )}

        {html !== null && (
          <>
            <div
              className="docpreview"
              dangerouslySetInnerHTML={{ __html: html || '<p style="color: #aaa; font-style: italic;">Le document ne contient pas de texte lisible.</p>' }}
            />

            {hasWarnings && (
              <div className="info-banner" style={{ marginTop: 12 }}>
                Certains éléments n'ont pas pu être convertis (images incorporées, styles avancés). Le rendu peut différer du document original.
              </div>
            )}
          </>
        )}
      </div>

      {html !== null && (
        <div className="tfoot">
          <div className="reassure">
            <IconShieldCheck size={14} />
            Conversion dans ton navigateur - aucun fichier envoyé.
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="rot-btn" onClick={handleRedo}>
              Changer de fichier
            </button>
            <button className="btn-primary" style={{ padding: '12px 22px' }} onClick={handleExport}>
              <IconWordToPdf size={17} />
              Exporter en PDF
            </button>
          </div>

          {popupBlocked && (
            <p style={{ width: '100%', fontSize: 12, color: 'var(--accent)', margin: 0 }}>
              Popup bloqué par le navigateur. Autorise les popups pour ce site, puis réessaie.
            </p>
          )}
        </div>
      )}
    </ToolLayout>
  )
}
