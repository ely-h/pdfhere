# CLAUDE.md

Context and rules for working on this project with Claude Code.

## The project

A PDF toolbox that runs 100% in the browser. No server, no upload, files never leave the user's machine. Inspired by iLovePDF but without the "we send your files to our servers" part. That's the core selling point: everything is local.

Hosted on GitHub Pages. GitHub username: ely-h.

## Languages

- Code, comments, docstrings, and commit messages: English.
- UI text shown to the user (buttons, labels, descriptions, errors): French.

## Stack (fixed)

- Vite + React 19 + TypeScript strict
- Tailwind v4 (single import in index.css, no tailwind.config.js)
- react-router-dom, one route per tool
- No global state. Local state per page. No Zustand, no Redux.
- As few dependencies as possible. Before adding a lib, check it's truly needed.

### Processing libs (lazy-loaded per tool via dynamic import)

- pdf-lib: PDF manipulation (merge, split, rotate, delete, watermark, page numbers, images to PDF, encryption)
- pdfjs-dist: PDF to canvas rendering (PDF to JPG, image extraction, thumbnails)
- mammoth: .docx to HTML for Word to PDF

The home page must stay light: no processing lib loaded until a tool is opened.

## Code rules

- TypeScript strict, no \`any\`. If an external lib type is missing, declare it properly.
- All PDF processing logic lives in \`src/lib/\`, as pure testable functions. The UI calls these functions, it never does processing itself.
- Factor components from the start: Dropzone, FileList, PageGrid, DownloadButton, Spinner. Do not rewrite a dropzone in each tool.
- Drag & drop reordering: native HTML5 first. Only add dnd-kit if native becomes unmanageable.
- Handle errors: corrupted PDF, non-PDF file, encrypted PDF without password. Clear message to the user (in French), no crash.
- Spinner during any heavy processing. Disable the button while working.

## Tool pattern

1. Dropzone
2. Preview / list (thumbnails when relevant)
3. Tool-specific options
4. Process button, with spinner
5. Download button

## Compress PDF logic

No Ghostscript (not feasible in a light client). Hybrid approach hidden behind a single slider:
- Detect the PDF's images
- Re-encode images via canvas to JPEG at quality set by the slider
- Clean / recompress streams with pdf-lib
- On image-free PDFs: pdf-lib cleanup only, low gain, that's expected

## Word to PDF, accepted limits

mammoth parses the .docx to HTML, then it's rendered to PDF. Show a clear banner: good rendering on simple docs only, complex layouts not guaranteed. Do not oversell.

## Out of scope, do not implement

- PDF to Word (not feasible properly without a server)
- OCR
- Electronic signature
- Text editing inside the PDF

If one of these comes up, say so and propose an alternative, don't start it.

## Author preferences (Elyssa)

- Talk to her in French, direct, no filler.
- No em-dashes anywhere (code, comments, UI text).
- No AI-sounding phrasing, no motivational padding. Short sentences.
- Fix real mistakes without hesitation, don't flatter.
- Targeted patches when editing: don't rewrite a whole file to change three lines.

## Visual style

- White rounded cards, soft shadow, colored icon per tool, bold title, grey description.
- Accent color per category: orange (organize), green (optimize), blue (convert).
- Clean and sober. Trust banner on the home: 100% local processing.

## Deployment

- \`base\` in vite.config.ts = repo name.
- GitHub Actions build + deploy to gh-pages.

## Git workflow

- Code, comments, and commit messages in English.
- One branch per tool or feature. Never commit directly to main.
- Branch naming: feat/<tool-name> or chore/<task>. Ex: feat/merge-pdf, chore/scaffold.
- Atomic commits on the branch, then merge into main once the step is validated.
- Never set yourself as author or co-author. No "Co-authored-by", no mention of Claude or any tool in commit messages. Elyssa is the sole author.
- Commit messages: plain, factual, English, no signature, no emoji.
- Never commit node_modules or dist.