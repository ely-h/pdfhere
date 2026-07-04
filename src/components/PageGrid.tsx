interface PageGridProps {
  thumbnails: string[]
  selected: Set<number>
  onToggle: (n: number) => void
  rotations?: Map<number, number>
  loading?: boolean
}

export function PageGrid({ thumbnails, selected, onToggle, rotations, loading }: PageGridProps) {
  if (loading) {
    return (
      <div className="tgrid">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="thumb" style={{ background: 'var(--surf2)' }} />
        ))}
      </div>
    )
  }

  return (
    <div className="tgrid">
      {thumbnails.map((src, i) => {
        const n = i + 1
        const isSel = selected.has(n)
        const rotation = rotations?.get(n) ?? 0
        const isRotated = rotation !== 0

        return (
          <div
            key={n}
            className={isSel ? 'thumb sel' : 'thumb'}
            onClick={() => onToggle(n)}
          >
            <img
              className="thumb-img"
              src={src}
              alt={`Page ${n}`}
              style={isRotated ? { transform: `rotate(${rotation}deg)`, maxWidth: '72%', maxHeight: '72%', objectFit: 'contain' } : undefined}
            />
            {isRotated && <span className="rot-badge">{rotation}°</span>}
            <span className="tcheck">
              <svg className="ic" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                <polyline points="5,13 10,18 19,6" />
              </svg>
            </span>
            <span className="pnum">{n}</span>
          </div>
        )
      })}
    </div>
  )
}
