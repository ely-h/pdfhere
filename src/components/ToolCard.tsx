import { Link } from 'react-router-dom'
import { type Tool, CATEGORY_COLOR } from '../lib/tools'

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  const { bg } = CATEGORY_COLOR[tool.category]
  return (
    <Link to={tool.route} className="block group">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-full hover:shadow-md transition-shadow">
        <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center text-2xl mb-3`}>
          {tool.icon}
        </div>
        <h3 className="font-semibold text-gray-900 mb-1 text-sm">{tool.title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{tool.description}</p>
      </div>
    </Link>
  )
}
