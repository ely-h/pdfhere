import { Link } from 'react-router-dom'
import { IconArrowLeft, IconShieldCheck } from './Icons'

interface ToolLayoutProps {
  title: string
  subtitle: string
  reassurance?: string
  children: React.ReactNode
}

export function ToolLayout({ title, subtitle, reassurance, children }: ToolLayoutProps) {
  return (
    <>
      <header className="thead">
        <div className="thleft">
          <Link to="/" className="back" aria-label="Retour">
            <IconArrowLeft />
          </Link>
          <div>
            <div className="ttitle">{title}</div>
            <div className="tsub">{subtitle}</div>
          </div>
        </div>
        <span className="chip">
          <IconShieldCheck />
          Traité en local
        </span>
      </header>

      {children}

      {reassurance && (
        <div className="tool-body" style={{ paddingTop: 0 }}>
          <div className="reassure">
            <IconShieldCheck size={14} />
            {reassurance}
          </div>
        </div>
      )}
    </>
  )
}
