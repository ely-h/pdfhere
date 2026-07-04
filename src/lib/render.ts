// pdfjs-dist rendering — lazy loaded; never imported at module top level from pages
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

let _lib: typeof import('pdfjs-dist') | null = null

async function pdfjs() {
  if (!_lib) {
    _lib = await import('pdfjs-dist')
    _lib.GlobalWorkerOptions.workerSrc = workerUrl
  }
  return _lib
}

export async function renderThumbnails(file: File, scale = 0.28): Promise<string[]> {
  const lib = await pdfjs()
  const doc = await lib.getDocument({ data: await file.arrayBuffer() }).promise
  const urls: string[] = []

  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n)
    const vp = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    canvas.width = vp.width
    canvas.height = vp.height
    await page.render({ canvas, viewport: vp }).promise
    urls.push(canvas.toDataURL('image/jpeg', 0.75))
    page.cleanup()
  }

  await doc.cleanup()
  return urls
}

export async function renderToCanvases(file: File, scale: number): Promise<HTMLCanvasElement[]> {
  const lib = await pdfjs()
  const doc = await lib.getDocument({ data: await file.arrayBuffer() }).promise
  const canvases: HTMLCanvasElement[] = []

  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n)
    const vp = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    canvas.width = vp.width
    canvas.height = vp.height
    await page.render({ canvas, viewport: vp }).promise
    canvases.push(canvas)
    page.cleanup()
  }

  await doc.cleanup()
  return canvases
}
