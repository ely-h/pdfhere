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

export async function rotatePdf(
  file: File,
  rotationDeltas: Map<number, number>,
): Promise<Blob> {
  const hasRotation = [...rotationDeltas.values()].some((d) => d !== 0)
  if (!hasRotation) return new Blob([await file.arrayBuffer()], { type: 'application/pdf' })

  const { PDFDocument, degrees } = await import('pdf-lib')
  let doc: Awaited<ReturnType<typeof PDFDocument.load>>
  try {
    doc = await PDFDocument.load(await file.arrayBuffer())
  } catch {
    throw new Error('Fichier corrompu ou non lisible.')
  }

  for (const [pageNum, delta] of rotationDeltas) {
    if (delta === 0) continue
    const page = doc.getPage(pageNum - 1)
    const current = page.getRotation().angle
    page.setRotation(degrees((current + delta + 360) % 360))
  }

  return new Blob([await doc.save()], { type: 'application/pdf' })
}

export async function deletePages(file: File, pageNums: number[]): Promise<Blob> {
  const { PDFDocument } = await import('pdf-lib')
  let src: Awaited<ReturnType<typeof PDFDocument.load>>
  try {
    src = await PDFDocument.load(await file.arrayBuffer())
  } catch {
    throw new Error('Fichier corrompu ou non lisible.')
  }
  const total = src.getPageCount()
  const deleteSet = new Set(pageNums)
  const keepIndices = Array.from({ length: total }, (_, i) => i).filter(
    (i) => !deleteSet.has(i + 1),
  )
  if (keepIndices.length === 0) throw new Error('Impossible de supprimer toutes les pages.')

  const out = await PDFDocument.create()
  const copied = await out.copyPages(src, keepIndices)
  copied.forEach((p) => out.addPage(p))
  return new Blob([await out.save()], { type: 'application/pdf' })
}

export async function imagesToPdf(files: File[]): Promise<Blob> {
  const { PDFDocument } = await import('pdf-lib')
  const doc = await PDFDocument.create()

  for (const f of files) {
    const bytes = new Uint8Array(await f.arrayBuffer())
    const isPng = f.type === 'image/png' || f.name.toLowerCase().endsWith('.png')
    const img = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes)
    const page = doc.addPage([img.width, img.height])
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height })
  }

  return new Blob([await doc.save()], { type: 'application/pdf' })
}

type PageNumPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

type PageNumFormat = 'arabic' | 'roman-lower' | 'roman-upper'

function toRoman(n: number): string {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
  const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
  let result = ''
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i] }
  }
  return result
}

function formatPageNum(n: number, format: PageNumFormat): string {
  if (format === 'arabic') return String(n)
  const roman = toRoman(Math.max(1, n))
  return format === 'roman-lower' ? roman.toLowerCase() : roman
}

export async function addPageNumbers(
  file: File,
  options: { position: PageNumPosition; startAt: number; fontSize: number; format: PageNumFormat },
): Promise<Blob> {
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')
  let doc: Awaited<ReturnType<typeof PDFDocument.load>>
  try {
    doc = await PDFDocument.load(await file.arrayBuffer())
  } catch {
    throw new Error('Fichier corrompu ou non lisible.')
  }

  const font = await doc.embedFont(StandardFonts.Helvetica)
  const margin = 22

  for (let i = 0; i < doc.getPageCount(); i++) {
    const page = doc.getPage(i)
    const { width, height } = page.getSize()
    const text = formatPageNum(i + options.startAt, options.format)
    const textWidth = font.widthOfTextAtSize(text, options.fontSize)
    const pos = options.position

    const x = pos.includes('left')
      ? margin
      : pos.includes('center')
        ? (width - textWidth) / 2
        : width - textWidth - margin

    const y = pos.startsWith('top')
      ? height - options.fontSize - margin
      : margin

    page.drawText(text, { x, y, size: options.fontSize, font, color: rgb(0.35, 0.35, 0.35) })
  }

  return new Blob([await doc.save()], { type: 'application/pdf' })
}

export async function addWatermark(
  file: File,
  options: { text: string; opacity: number; angle: number; fontSize: number },
): Promise<Blob> {
  const { PDFDocument, rgb, StandardFonts, degrees } = await import('pdf-lib')
  let doc: Awaited<ReturnType<typeof PDFDocument.load>>
  try {
    doc = await PDFDocument.load(await file.arrayBuffer())
  } catch {
    throw new Error('Fichier corrompu ou non lisible.')
  }

  const font = await doc.embedFont(StandardFonts.HelveticaBold)

  for (let i = 0; i < doc.getPageCount(); i++) {
    const page = doc.getPage(i)
    const { width, height } = page.getSize()
    const textWidth = font.widthOfTextAtSize(options.text, options.fontSize)

    page.drawText(options.text, {
      x: width / 2 - textWidth / 2,
      y: height / 2,
      size: options.fontSize,
      font,
      color: rgb(0.4, 0.4, 0.4),
      opacity: options.opacity,
      rotate: degrees(options.angle),
    })
  }

  return new Blob([await doc.save()], { type: 'application/pdf' })
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
