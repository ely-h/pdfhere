import { Link } from 'react-router-dom'
import type { Tool } from '../lib/tools'
import { ToolIcon, IconArrowRight } from './Icons'

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  const tileClass = [
    'tile',
    tool.live ? 'tile-live' : '',
    tool.hot ? 'tile-hot' : '',
  ].filter(Boolean).join(' ')

  const glyphClass = tool.hot ? 'glyph glyph-w' : 'glyph'

  if (!tool.live) {
    return (
      <div className={tileClass}>
        <span className={glyphClass}>
          <ToolIcon id={tool.icon} />
        </span>
        <span className="tname">{tool.title}</span>
        <span className="tdesc">{tool.description}</span>
      </div>
    )
  }

  return (
    <Link to={tool.route} className={tileClass}>
      <span className={glyphClass}>
        <ToolIcon id={tool.icon} />
      </span>
      <span className="tname">{tool.title}</span>
      <span className="tdesc">{tool.description}</span>
      <span className="arr">
        <IconArrowRight />
      </span>
    </Link>
  )
}
