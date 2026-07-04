import { ToolLayout } from '../../components/ToolLayout'

export default function SplitPdf() {
  return (
    <ToolLayout
      title="Split PDF"
      subtitle="Clique les pages à extraire."
      reassurance="Miniatures rendues par ton navigateur — aucune page envoyée."
    >
      <div className="tool-body">
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>Outil en cours de développement.</p>
      </div>
    </ToolLayout>
  )
}
