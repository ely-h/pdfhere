import { TOOLS, CATEGORIES, CATEGORY_COLOR } from '../lib/tools'
import { ToolCard } from '../components/ToolCard'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <span className="font-bold text-gray-900 text-lg">PDF Here</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Outils PDF gratuits</h1>
          <p className="text-gray-500">Simple, rapide, sans inscription.</p>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-xl px-5 py-3 mb-10 text-sm text-green-800 text-center">
          Vos fichiers ne quittent jamais votre navigateur. Aucun upload, aucun serveur.
        </div>

        {CATEGORIES.map((cat) => {
          const catTools = TOOLS.filter((t) => t.category === cat)
          if (catTools.length === 0) return null
          const { badge } = CATEGORY_COLOR[cat]
          return (
            <section key={cat} className="mb-10">
              <div className="mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge}`}>
                  {cat}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {catTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}
