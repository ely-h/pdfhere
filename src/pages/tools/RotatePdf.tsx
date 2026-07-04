import { ToolLayout } from '../../components/ToolLayout'

export default function RotatePdf() {
  return (
    <ToolLayout
      title="Rotate PDF"
      subtitle="Sélectionne les pages à faire pivoter."
      reassurance="Rotation calculée sur ton appareil. Rien n'est envoyé."
    >
      <div className="tool-body">
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>Outil en cours de développement.</p>
      </div>
    </ToolLayout>
  )
}
