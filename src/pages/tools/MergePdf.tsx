import { ToolLayout } from '../../components/ToolLayout'

export default function MergePdf() {
  return (
    <ToolLayout
      title="Merge PDF"
      subtitle="Glisse les fichiers pour les réordonner."
      reassurance="Fusion calculée sur ton appareil. Rien n'est envoyé."
    >
      <div className="tool-body">
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>Outil en cours de développement.</p>
      </div>
    </ToolLayout>
  )
}
