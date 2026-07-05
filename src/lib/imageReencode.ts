// Browser-only JPEG re-decode/re-encode, isolated here so compress logic in pdf.ts stays testable.

export interface ReencodedImage {
  bytes: Uint8Array
  width: number
  height: number
}

export async function reencodeJpeg(
  bytes: Uint8Array,
  quality: number,
  maxDimension: number,
): Promise<ReencodedImage | null> {
  const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/jpeg' }))
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    return null
  }

  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality),
  )
  return { bytes: new Uint8Array(await blob.arrayBuffer()), width, height }
}
