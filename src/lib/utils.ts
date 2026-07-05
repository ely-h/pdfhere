export function formatSize(bytes: number): string {
  if (bytes >= 1_000_000) return (bytes / 1_000_000).toFixed(1).replace('.', ',') + ' Mo'
  if (bytes >= 1_000) return Math.round(bytes / 1_000) + ' Ko'
  return bytes + ' o'
}
