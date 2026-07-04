// pdf-lib processing -- lazy loaded per tool via dynamic import

export async function getPageCount(file: File): Promise<number> {
  const { PDFDocument } = await import('pdf-lib')
  const doc = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false })
  return doc.getPageCount()
}

export async function mergePdfs(
  files: File[],
  _opts: { keepBookmarks: boolean; flatten: boolean },
): Promise<Blob> {
  const { PDFDocument } = await import('pdf-lib')
  const merged = await PDFDocument.create()

  for (const file of files) {
    let src: Awaited<ReturnType<typeof PDFDocument.load>>
    try {
      src = await PDFDocument.load(await file.arrayBuffer())
    } catch {
      throw new Error(`Fichier corrompu ou non lisible : ${file.name}`)
    }
    const copied = await merged.copyPages(src, src.getPageIndices())
    copied.forEach((p) => merged.addPage(p))
  }

  const bytes = await merged.save()
  return new Blob([bytes], { type: 'application/pdf' })
}

export async function extractPages(file: File, pageNums: number[]): Promise<Blob> {
  const { PDFDocument } = await import('pdf-lib')
  let src: Awaited<ReturnType<typeof PDFDocument.load>>
  try {
    src = await PDFDocument.load(await file.arrayBuffer())
  } catch {
    throw new Error('Fichier corrompu ou non lisible.')
  }

  const out = await PDFDocument.create()
  const copied = await out.copyPages(src, pageNums.map((n) => n - 1))
  copied.forEach((p) => out.addPage(p))

  const bytes = await out.save()
  return new Blob([bytes], { type: 'application/pdf' })
}

export async function splitBurst(file: File, pageNums: number[]): Promise<Blob[]> {
  const { PDFDocument } = await import('pdf-lib')
  let src: Awaited<ReturnType<typeof PDFDocument.load>>
  try {
    src = await PDFDocument.load(await file.arrayBuffer())
  } catch {
    throw new Error('Fichier corrompu ou non lisible.')
  }

  const blobs: Blob[] = []
  for (const n of pageNums) {
    const out = await PDFDocument.create()
    const [p] = await out.copyPages(src, [n - 1])
    out.addPage(p)
    blobs.push(new Blob([await out.save()], { type: 'application/pdf' }))
  }
  return blobs
}

export async function compressPdf(file: File, compress: number): Promise<Blob> {
  // compress 0 = max quality, 100 = max compression
  const jpegQ = Math.max(0.05, 1 - (compress / 100) * 0.92)
  const scale = Math.max(0.7, 1.5 - (compress / 100) * 0.8)

  const { renderToCanvases } = await import('./render')
  const canvases = await renderToCanvases(file, scale)

  const { PDFDocument } = await import('pdf-lib')
  const out = await PDFDocument.create()

  for (const canvas of canvases) {
    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), 'image/jpeg', jpegQ),
    )
    const img = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()))
    const page = out.addPage([canvas.width, canvas.height])
    page.drawImage(img, { x: 0, y: 0, width: canvas.width, height: canvas.height })
  }

  return new Blob([await out.save()], { type: 'application/pdf' })
}
