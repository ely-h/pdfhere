import { ToolLayout } from '../../components/ToolLayout'

export default function DeletePages() {
  return (
    <ToolLayout
      title="Delete pages"
      subtitle="Sélectionne les pages à supprimer."
      reassurance="Traitement local - aucun fichier envoyé."
    >
      <div className="tool-body">
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>Outil en cours de développement.</p>
      </div>
    </ToolLayout>
  )
}
