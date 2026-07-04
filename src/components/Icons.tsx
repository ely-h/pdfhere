import type { IconId } from '../lib/tools'

interface SvgProps {
  size?: number
  strokeWidth?: number
  className?: string
}

function Svg({ size = 21, strokeWidth = 1.7, className = 'ic', children }: SvgProps & { children: React.ReactNode }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    >
      {children}
    </svg>
  )
}

export function IconMerge({ size = 21 }: SvgProps) {
  return (
    <Svg size={size}>
      <rect x="4" y="3.5" width="11" height="14" rx="2.5" />
      <rect x="9" y="6.5" width="11" height="14" rx="2.5" />
    </Svg>
  )
}

export function IconSplit({ size = 21 }: SvgProps) {
  return (
    <Svg size={size}>
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <line x1="12" y1="4" x2="12" y2="20" strokeDasharray="2.5 2.5" />
    </Svg>
  )
}

export function IconRotate({ size = 21 }: SvgProps) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12.5" r="7" />
      <polygon points="11,3 16,4.5 12,8" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function IconDelete({ size = 21 }: SvgProps) {
  return (
    <Svg size={size}>
      <rect x="5" y="4" width="14" height="16" rx="2.5" />
      <line x1="9.5" y1="9.5" x2="14.5" y2="14.5" />
      <line x1="14.5" y1="9.5" x2="9.5" y2="14.5" />
    </Svg>
  )
}

export function IconCompress({ size = 21 }: SvgProps) {
  return (
    <Svg size={size}>
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <polyline points="9,7.5 12,10.5 15,7.5" />
      <polyline points="9,16.5 12,13.5 15,16.5" />
    </Svg>
  )
}

export function IconPageNumbers({ size = 21 }: SvgProps) {
  return (
    <Svg size={size}>
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <text x="12" y="16" fontSize="11" fontWeight="700" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="monospace">#</text>
    </Svg>
  )
}

export function IconWatermark({ size = 21 }: SvgProps) {
  return (
    <Svg size={size}>
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <line x1="7" y1="17" x2="17" y2="7" opacity="0.7" />
      <line x1="11" y1="17" x2="17" y2="11" opacity="0.4" />
    </Svg>
  )
}

export function IconImgToPdf({ size = 21 }: SvgProps) {
  return (
    <Svg size={size}>
      <rect x="3" y="6" width="7" height="11" rx="1.5" />
      <rect x="14" y="6" width="7" height="11" rx="1.5" />
      <polyline points="11,9.5 14,11.5 11,13.5" />
    </Svg>
  )
}

export function IconPdfToImg({ size = 21 }: SvgProps) {
  return (
    <Svg size={size}>
      <rect x="14" y="6" width="7" height="11" rx="1.5" />
      <rect x="3" y="6" width="7" height="11" rx="1.5" />
      <polyline points="13,9.5 10,11.5 13,13.5" />
    </Svg>
  )
}

export function IconWordToPdf({ size = 21 }: SvgProps) {
  return (
    <Svg size={size}>
      <rect x="3" y="6" width="7" height="11" rx="1.5" />
      <rect x="14" y="6" width="7" height="11" rx="1.5" />
      <polyline points="11,9.5 14,11.5 11,13.5" />
    </Svg>
  )
}

export function IconArrowRight({ size = 16 }: SvgProps) {
  return (
    <Svg size={size} strokeWidth={2.2}>
      <polyline points="9,6 15,12 9,18" />
    </Svg>
  )
}

export function IconArrowLeft({ size = 17 }: SvgProps) {
  return (
    <Svg size={size} strokeWidth={2}>
      <polyline points="13,5 7,12 13,19" />
    </Svg>
  )
}

export function IconShieldCheck({ size = 14 }: SvgProps) {
  return (
    <Svg size={size} strokeWidth={2}>
      <polygon points="12,3 20,6.5 20,12 12,21 4,12 4,6.5" />
      <polyline points="8.5,12 11,14.5 15.5,9" />
    </Svg>
  )
}

export function IconUpload({ size = 22 }: SvgProps) {
  return (
    <Svg size={size} strokeWidth={2}>
      <polyline points="12,15 12,4" />
      <polyline points="7,9 12,4 17,9" />
      <line x1="4" y1="19" x2="20" y2="19" />
    </Svg>
  )
}

export function IconDownload({ size = 18 }: SvgProps) {
  return (
    <Svg size={size} strokeWidth={2}>
      <polyline points="12,4 12,15" />
      <polyline points="7,10 12,15 17,10" />
      <line x1="5" y1="19" x2="19" y2="19" />
    </Svg>
  )
}

export function IconCheck({ size = 32 }: SvgProps) {
  return (
    <Svg size={size} strokeWidth={2.4}>
      <polyline points="5,13 10,18 19,6" />
    </Svg>
  )
}

export function IconDragHandle() {
  return (
    <svg className="ic" width={11} height={17} viewBox="0 0 12 18" fill="currentColor" stroke="none">
      <circle cx="4" cy="4" r="1.4" />
      <circle cx="4" cy="9" r="1.4" />
      <circle cx="4" cy="14" r="1.4" />
      <circle cx="8" cy="4" r="1.4" />
      <circle cx="8" cy="9" r="1.4" />
      <circle cx="8" cy="14" r="1.4" />
    </svg>
  )
}

export function IconX({ size = 15 }: SvgProps) {
  return (
    <Svg size={size} strokeWidth={2}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </Svg>
  )
}

export function IconArrowForward({ size = 22 }: SvgProps) {
  return (
    <Svg size={size} strokeWidth={2}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13,6 19,12 13,18" />
    </Svg>
  )
}

const ICON_MAP: Record<IconId, (props: SvgProps) => React.ReactElement> = {
  merge: IconMerge,
  split: IconSplit,
  rotate: IconRotate,
  delete: IconDelete,
  compress: IconCompress,
  'page-numbers': IconPageNumbers,
  watermark: IconWatermark,
  'img-to-pdf': IconImgToPdf,
  'pdf-to-img': IconPdfToImg,
  'word-to-pdf': IconWordToPdf,
}

export function ToolIcon({ id, size = 21 }: { id: IconId; size?: number }) {
  const Component = ICON_MAP[id]
  return <Component size={size} />
}
