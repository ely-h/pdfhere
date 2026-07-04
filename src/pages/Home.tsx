import { TOOLS, CATEGORIES, CATEGORY_COUNTS } from '../lib/tools'
import { ToolCard } from '../components/ToolCard'
import { IconShieldCheck } from '../components/Icons'

export default function Home() {
  return (
    <>
      <header className="pbar">
        <span className="logo">
          PDF<span className="logo-acc">Here</span>
        </span>
        <nav className="pnav">
          <span className="navlink">Outils</span>
          <span className="navlink">Confidentialité</span>
        </nav>
        <span className="chip">
          <IconShieldCheck />
          100% local
        </span>
      </header>

      <main className="home-body">
        <h1 className="htitle">
          Tes PDF, traités <br />chez toi. Vraiment.
        </h1>

        <div className="bigpriv">
          <span className="bpbig">0 upload.</span>
          <span className="bpsub">
            Tes documents ne quittent jamais ton appareil. Tout tourne dans le navigateur, même hors-ligne.
          </span>
        </div>

        <div className="cats">
          {CATEGORIES.map((cat) => {
            const catTools = TOOLS.filter((t) => t.category === cat)
            if (catTools.length === 0) return null
            const count = CATEGORY_COUNTS[cat]
            const showGhost = cat === 'Optimiser'

            return (
              <div key={cat}>
                <div className="cath">
                  <span className="catname">{cat}</span>
                  <span className="cnt">{count} outils</span>
                </div>
                <div className="tiles">
                  {catTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                  {showGhost && <div className="tile tile-ghost" aria-hidden="true" />}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
