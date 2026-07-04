import { ToolLayout } from '../../components/ToolLayout'

export default function CompressPdf() {
  return (
    <ToolLayout
      title="Compress PDF"
      subtitle="Ajuste le curseur pour viser la bonne taille."
      reassurance="Compression effectuée localement, dans ton navigateur."
    >
      <div className="tool-body">
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>Outil en cours de développement.</p>
      </div>
    </ToolLayout>
  )
}
