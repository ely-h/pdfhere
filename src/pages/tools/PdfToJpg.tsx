import { ToolLayout } from '../../components/ToolLayout'

export default function PdfToJpg() {
  return (
    <ToolLayout
      title="PDF to JPG"
      subtitle="Exporte chaque page du PDF en image."
      reassurance="Export effectué dans ton navigateur - aucune page envoyée."
    >
      <div className="tool-body">
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>Outil en cours de développement.</p>
      </div>
    </ToolLayout>
  )
}
