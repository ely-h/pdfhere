import { ToolLayout } from '../../components/ToolLayout'

export default function Watermark() {
  return (
    <ToolLayout
      title="Watermark"
      subtitle="Ajoute un texte en filigrane sur tes pages."
      reassurance="Traitement local - aucun fichier envoyé."
    >
      <div className="tool-body">
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>Outil en cours de développement.</p>
      </div>
    </ToolLayout>
  )
}
