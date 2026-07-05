import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFDocument } from 'pdf-lib'
import { describe, expect, it, vi } from 'vitest'
import { makeTestPdf, toFile } from './test-fixtures'

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), '__fixtures__')
const tinyJpgBytes = readFileSync(join(fixturesDir, 'tiny.jpg'))

interface FakeCanvas {
  width: number
  height: number
  toBlob(callback: (blob: Blob | null) => void): void
}

function makeFakeCanvas(width: number, height: number): FakeCanvas {
  return {
    width,
    height,
    toBlob: (callback) => callback(new Blob([new Uint8Array(tinyJpgBytes)], { type: 'image/jpeg' })),
  }
}

const mockRenderState = { canvasCount: 2 }

vi.mock('./render', () => ({
  renderToCanvases: vi.fn(async () =>
    Array.from({ length: mockRenderState.canvasCount }, () => makeFakeCanvas(4, 6)),
  ),
}))

import { compressPdf } from './pdf'
import { renderToCanvases } from './render'

describe('compressPdf', () => {
  it('rebuilds the PDF from re-encoded page images', async () => {
    mockRenderState.canvasCount = 2
    const file = toFile(await makeTestPdf(2), 'src.pdf')
    const blob = await compressPdf(file, 50)
    const out = await PDFDocument.load(await blob.arrayBuffer())

    expect(out.getPageCount()).toBe(2)
    expect(out.getPage(0).getSize()).toEqual({ width: 4, height: 6 })
  })

  it('propagates a rendering failure (invalid PDF)', async () => {
    vi.mocked(renderToCanvases).mockRejectedValueOnce(new Error('invalid pdf'))
    const file = toFile(await makeTestPdf(1), 'src.pdf')

    await expect(compressPdf(file, 50)).rejects.toThrow('invalid pdf')
  })
})
