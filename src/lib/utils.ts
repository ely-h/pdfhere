export function formatSize(bytes: number): string {
  if (bytes >= 1_000_000) return (bytes / 1_000_000).toFixed(1).replace('.', ',') + ' Mo'
  if (bytes >= 1_000) return Math.round(bytes / 1_000) + ' Ko'
  return bytes + ' o'
}

export function estimateCompressedSize(originalBytes: number, compress: number): number {
  return Math.round(originalBytes * (1 - (compress / 100) * 0.78))
}
