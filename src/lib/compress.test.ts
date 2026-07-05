import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFDict, PDFDocument, PDFName, PDFRawStream, PDFRef } from 'pdf-lib'
import { describe, expect, it, vi } from 'vitest'
import { INVALID_BYTES, makeTestPdf, toFile } from './test-fixtures'

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), '__fixtures__')
const tinyJpgBytes = new Uint8Array(readFileSync(join(fixturesDir, 'tiny.jpg')))

vi.mock('./imageReencode', () => ({
  reencodeJpeg: vi.fn(async (bytes: Uint8Array) => ({
    bytes: bytes.slice(0, Math.max(1, Math.floor(bytes.length / 4))),
    width: 2,
    height: 2,
  })),
}))

import { compressPdf } from './pdf'
import { reencodeJpeg } from './imageReencode'

async function makePdfWithJpeg(): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const img = await doc.embedJpg(tinyJpgBytes)
  const page = doc.addPage([100, 100])
  page.drawImage(img, { x: 0, y: 0, width: 100, height: 100 })
  return doc.save()
}

function findImageStream(doc: PDFDocument): PDFRawStream {
  const xobjects = doc.getPage(0).node.Resources()?.lookup(PDFName.of('XObject'))
  if (!(xobjects instanceof PDFDict)) throw new Error('no xobjects')
  const ref = xobjects.get(xobjects.keys()[0])
  if (!(ref instanceof PDFRef)) throw new Error('not a ref')
  const stream = doc.context.lookup(ref)
  if (!(stream instanceof PDFRawStream)) throw new Error('not a raw stream')
  return stream
}

describe('compressPdf', () => {
  it('re-encodes embedded JPEG images and shrinks the file', async () => {
    const file = toFile(await makePdfWithJpeg(), 'src.pdf')
    const blob = await compressPdf(file, 60)
    const out = await PDFDocument.load(await blob.arrayBuffer())

    expect(out.getPageCount()).toBe(1)
    const stream = findImageStream(out)
    expect(stream.contents.length).toBeLessThan(tinyJpgBytes.length)
    expect(reencodeJpeg).toHaveBeenCalledTimes(1)
  })

  it('leaves a PDF with no images essentially as-is (low gain, no crash)', async () => {
    const file = toFile(await makeTestPdf(2), 'text-only.pdf')
    const blob = await compressPdf(file, 60)
    const out = await PDFDocument.load(await blob.arrayBuffer())

    expect(out.getPageCount()).toBe(2)
    expect(reencodeJpeg).not.toHaveBeenCalled()
  })

  it('rejects on a corrupted file', async () => {
    const bad = toFile(INVALID_BYTES, 'bad.pdf')
    await expect(compressPdf(bad, 60)).rejects.toThrow(/corrompu/)
  })
})
