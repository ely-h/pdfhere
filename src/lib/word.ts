// mammoth: lazy loaded, never statically imported from tool pages

export async function docxToHtml(file: File): Promise<{ html: string; hasWarnings: boolean }> {
  if (!file.name.toLowerCase().endsWith('.docx')) {
    throw new Error('Format non supporté. Utilise un fichier .docx (Word 2007+).')
  }

  const { convertToHtml } = await import('mammoth')
  const result = await convertToHtml({ arrayBuffer: await file.arrayBuffer() })

  return {
    html: result.value,
    hasWarnings: result.messages.some((m) => m.type === 'warning'),
  }
}

const PRINT_STYLES = `
  @page { size: A4 portrait; margin: 20mm 16mm; }
  *, *::before, *::after { box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; font-size: 11pt; line-height: 1.6; color: #000; margin: 0; }
  h1 { font-size: 18pt; font-weight: bold; margin: 0 0 10pt; }
  h2 { font-size: 14pt; font-weight: bold; margin: 14pt 0 6pt; }
  h3 { font-size: 12pt; font-weight: bold; margin: 10pt 0 4pt; }
  h4, h5, h6 { font-size: 11pt; font-weight: bold; margin: 8pt 0 3pt; }
  p { margin: 0 0 7pt; }
  ul, ol { margin: 0 0 7pt; padding-left: 18pt; }
  li { margin: 2pt 0; }
  table { border-collapse: collapse; width: 100%; margin: 8pt 0; page-break-inside: avoid; }
  td, th { border: 1px solid #aaa; padding: 3pt 5pt; font-size: 10pt; vertical-align: top; }
  th { background: #f0f0f0; font-weight: bold; }
  img { max-width: 100%; height: auto; }
  blockquote { margin: 8pt 0 8pt 14pt; padding-left: 8pt; border-left: 2pt solid #ccc; font-style: italic; }
  a { color: #000; text-decoration: underline; }
  strong, b { font-weight: bold; }
  em, i { font-style: italic; }
`

export function openPrintWindow(html: string, docName: string): boolean {
  const title = docName.replace(/[<>&"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c] ?? c,
  )

  const content = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>${PRINT_STYLES}</style>
</head>
<body>${html}</body>
</html>`

  const win = window.open('', '_blank')
  if (!win) return false

  win.document.write(content)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 350)
  return true
}
