import { describe, expect, it } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import {
  deletePages,
  extractPages,
  imagesToPdf,
  mergePdfs,
  rotatePdf,
  splitBurst,
} from './pdf'
import { INVALID_BYTES, makeTestPdf, tinyJpgFile, tinyPngFile, toFile } from './test-fixtures'

describe('mergePdfs', () => {
  it('merges two PDFs into one with the combined page count', async () => {
    const fileA = toFile(await makeTestPdf(2), 'a.pdf')
    const fileB = toFile(await makeTestPdf(3), 'b.pdf')

    const blob = await mergePdfs([fileA, fileB], { keepBookmarks: false, flatten: false })
    const merged = await PDFDocument.load(await blob.arrayBuffer())

    expect(merged.getPageCount()).toBe(5)
  })

  it('rejects with a clear message on a corrupted file', async () => {
    const bad = toFile(INVALID_BYTES, 'bad.pdf')
    await expect(mergePdfs([bad], { keepBookmarks: false, flatten: false })).rejects.toThrow(
      /corrompu/,
    )
  })
})

describe('extractPages (split - range)', () => {
  it('extracts the requested pages in order', async () => {
    const file = toFile(await makeTestPdf(5), 'src.pdf')
    const blob = await extractPages(file, [2, 3])
    const out = await PDFDocument.load(await blob.arrayBuffer())

    expect(out.getPageCount()).toBe(2)
  })

  it('rejects on a corrupted file', async () => {
    const bad = toFile(INVALID_BYTES, 'bad.pdf')
    await expect(extractPages(bad, [1])).rejects.toThrow(/corrompu/)
  })
})

describe('splitBurst (split - one file per page)', () => {
  it('returns one blob per requested page', async () => {
    const file = toFile(await makeTestPdf(3), 'src.pdf')
    const blobs = await splitBurst(file, [1, 2, 3])

    expect(blobs).toHaveLength(3)
    for (const blob of blobs) {
      const out = await PDFDocument.load(await blob.arrayBuffer())
      expect(out.getPageCount()).toBe(1)
    }
  })

  it('rejects on a corrupted file', async () => {
    const bad = toFile(INVALID_BYTES, 'bad.pdf')
    await expect(splitBurst(bad, [1])).rejects.toThrow(/corrompu/)
  })
})

describe('rotatePdf', () => {
  it('applies the rotation delta to the targeted page', async () => {
    const file = toFile(await makeTestPdf(2), 'src.pdf')
    const blob = await rotatePdf(file, new Map([[1, 90]]))
    const out = await PDFDocument.load(await blob.arrayBuffer())

    expect(out.getPage(0).getRotation().angle).toBe(90)
    expect(out.getPage(1).getRotation().angle).toBe(0)
  })

  it('returns the file untouched when all deltas are zero', async () => {
    const bytes = await makeTestPdf(1)
    const file = toFile(bytes, 'src.pdf')
    const blob = await rotatePdf(file, new Map([[1, 0]]))

    expect(new Uint8Array(await blob.arrayBuffer())).toEqual(bytes)
  })

  it('rejects on a corrupted file', async () => {
    const bad = toFile(INVALID_BYTES, 'bad.pdf')
    await expect(rotatePdf(bad, new Map([[1, 90]]))).rejects.toThrow(/corrompu/)
  })

  it('rejects when targeting a page number beyond the document page count', async () => {
    const file = toFile(await makeTestPdf(1), 'one-page.pdf')
    await expect(rotatePdf(file, new Map([[2, 90]]))).rejects.toThrow()
  })
})

describe('deletePages', () => {
  it('removes the requested pages', async () => {
    const file = toFile(await makeTestPdf(3), 'src.pdf')
    const blob = await deletePages(file, [2])
    const out = await PDFDocument.load(await blob.arrayBuffer())

    expect(out.getPageCount()).toBe(2)
  })

  it('rejects when asked to delete every page', async () => {
    const file = toFile(await makeTestPdf(2), 'src.pdf')
    await expect(deletePages(file, [1, 2])).rejects.toThrow(/Impossible de supprimer/)
  })

  it('rejects on a PDF created with zero pages (pdf-lib normalizes it to a single page on reload)', async () => {
    const file = toFile(await makeTestPdf(0), 'empty.pdf')
    await expect(deletePages(file, [1])).rejects.toThrow(/Impossible de supprimer/)
  })

  it('rejects on a corrupted file', async () => {
    const bad = toFile(INVALID_BYTES, 'bad.pdf')
    await expect(deletePages(bad, [1])).rejects.toThrow(/corrompu/)
  })
})

describe('imagesToPdf', () => {
  it('creates one page per image, sized to the image dimensions', async () => {
    const blob = await imagesToPdf([tinyPngFile('a.png'), tinyJpgFile('b.jpg')])
    const out = await PDFDocument.load(await blob.arrayBuffer())

    expect(out.getPageCount()).toBe(2)
    expect(out.getPage(0).getSize()).toEqual({ width: 2, height: 2 })
    expect(out.getPage(1).getSize()).toEqual({ width: 2, height: 2 })
  })

  it('rejects when the image bytes do not match the declared type', async () => {
    const mislabeled = tinyPngFile('fake.jpg', 'image/jpeg')
    await expect(imagesToPdf([mislabeled])).rejects.toThrow()
  })
})
