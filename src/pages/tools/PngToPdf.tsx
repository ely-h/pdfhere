import { ToolLayout } from '../../components/ToolLayout'

export default function PngToPdf() {
  return (
    <ToolLayout
      title="PNG to PDF"
      subtitle="Assemble tes images en un seul PDF."
      reassurance="Conversion effectuée localement — aucun fichier envoyé."
    >
      <div className="tool-body">
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>Outil en cours de développement.</p>
      </div>
    </ToolLayout>
  )
}
