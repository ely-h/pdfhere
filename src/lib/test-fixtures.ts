import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFDocument } from 'pdf-lib'

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), '__fixtures__')

export async function makeTestPdf(pageCount: number, size: [number, number] = [200, 300]): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  for (let i = 0; i < pageCount; i++) doc.addPage(size)
  return doc.save()
}

export function toFile(bytes: Uint8Array, name = 'test.pdf', type = 'application/pdf'): File {
  return new File([new Uint8Array(bytes)], name, { type })
}

export const INVALID_BYTES = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04, 0x05])

export function tinyJpgFile(name = 'tiny.jpg', type = 'image/jpeg'): File {
  return toFile(readFileSync(join(fixturesDir, 'tiny.jpg')), name, type)
}

export function tinyPngFile(name = 'tiny.png', type = 'image/png'): File {
  return toFile(readFileSync(join(fixturesDir, 'tiny.png')), name, type)
}
