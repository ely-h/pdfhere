import { ToolLayout } from '../../components/ToolLayout'

export default function WordToPdf() {
  return (
    <ToolLayout
      title="Word to PDF"
      subtitle="Conversion dans le navigateur — résultat indicatif."
      reassurance="Conversion effectuée localement via mammoth. Résultat optimal sur les documents simples."
    >
      <div className="tool-body">
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>Outil en cours de développement.</p>
      </div>
    </ToolLayout>
  )
}
