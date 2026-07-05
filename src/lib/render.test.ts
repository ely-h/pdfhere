// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockPdfState = { numPages: 2, shouldFail: false }

vi.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: { workerSrc: '' },
  getDocument: () => ({
    promise: mockPdfState.shouldFail
      ? Promise.reject(new Error('invalid pdf'))
      : Promise.resolve({
          numPages: mockPdfState.numPages,
          getPage: async () => ({
            getViewport: () => ({ width: 10, height: 10 }),
            render: () => ({ promise: Promise.resolve() }),
            cleanup: () => {},
          }),
          cleanup: async () => {},
        }),
  }),
}))

import { renderThumbnails, renderToCanvases, renderToJpegs } from './render'
import { makeTestPdf, toFile } from './test-fixtures'

beforeEach(() => {
  mockPdfState.numPages = 2
  mockPdfState.shouldFail = false
  HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/jpeg;base64,')
  HTMLCanvasElement.prototype.toBlob = vi.fn(function (callback: BlobCallback) {
    callback(new Blob(['fake-jpeg'], { type: 'image/jpeg' }))
  })
})

describe('renderThumbnails', () => {
  it('returns one data URL per page', async () => {
    mockPdfState.numPages = 3
    const file = toFile(await makeTestPdf(3), 'src.pdf')
    const urls = await renderThumbnails(file)

    expect(urls).toHaveLength(3)
    expect(urls[0]).toMatch(/^data:image\/jpeg/)
  })

  it('propagates an error for an invalid PDF', async () => {
    mockPdfState.shouldFail = true
    const file = toFile(new Uint8Array([1, 2, 3]), 'bad.pdf')

    await expect(renderThumbnails(file)).rejects.toThrow()
  })
})

describe('renderToCanvases', () => {
  it('returns one canvas per page, sized from the viewport', async () => {
    const file = toFile(await makeTestPdf(2), 'src.pdf')
    const canvases = await renderToCanvases(file, 1)

    expect(canvases).toHaveLength(2)
    expect(canvases[0].width).toBe(10)
    expect(canvases[0].height).toBe(10)
  })

  it('returns an empty array for a PDF with zero pages', async () => {
    mockPdfState.numPages = 0
    const file = toFile(await makeTestPdf(0), 'empty.pdf')
    const canvases = await renderToCanvases(file, 1)

    expect(canvases).toHaveLength(0)
  })
})

describe('renderToJpegs', () => {
  it('returns one JPEG blob per page', async () => {
    const file = toFile(await makeTestPdf(2), 'src.pdf')
    const blobs = await renderToJpegs(file)

    expect(blobs).toHaveLength(2)
    for (const blob of blobs) expect(blob.type).toBe('image/jpeg')
  })
})
