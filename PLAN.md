# PLAN — Boîte à outils PDF 100% client

Site d'outils PDF qui tourne entièrement dans le navigateur. Aucun serveur, aucun upload. Les fichiers ne quittent jamais la machine de l'user. Déploiement GitHub Pages, façon Skein.

## Argument central

Tout le traitement est local. C'est le vrai argument vs iLovePDF/Smallpdf qui uploadent tes fichiers sur leurs serveurs. À mettre en avant dans l'UI : "Vos fichiers ne quittent jamais votre navigateur".

## Stack

- Vite + React 19 + TypeScript strict
- Tailwind v4 (import unique, pas de config tailwind.config.js)
- react-router-dom pour les routes (une route par outil)
- Pas de state global. State local par page. Pas de Zustand ici, inutile.
- Build statique, base path configuré pour GitHub Pages

### Libs de traitement

| Lib | Rôle |
|-----|------|
| pdf-lib | manipulation PDF : merge, split, rotate, delete, reorder, watermark, page numbers, images→PDF, chiffrement |
| pdfjs-dist | rendu PDF→canvas : PDF→JPG, extraction images, miniatures/preview |
| mammoth | parsing .docx → HTML (pour Word→PDF) |

Tout en lazy-load par outil : chaque page importe sa lib en dynamic import pour que la home reste légère.

## Scope v1

### Outils sûrs (full pdf-lib / pdfjs)
1. **Merge PDF** — fusionner plusieurs PDF, ordre réglable par drag
2. **Split PDF** — extraire une plage de pages ou éclater en fichiers séparés
3. **Compress PDF** — logique hybride : ré-encodage images via canvas (qualité réglable) + nettoyage pdf-lib. Curseur unique pour l'user
4. **JPG to PDF** — une ou plusieurs images → un PDF, ordre réglable
5. **PNG to PDF** — idem
6. **PDF to JPG** — chaque page → image, téléchargées en zip
7. **Rotate PDF** — rotation par page ou globale
8. **Delete pages** — supprimer des pages choisies
9. **Page numbers** — ajouter numéros de page (position, format réglables)
10. **Watermark** — texte en filigrane (opacité, angle, taille)

### Bonus (limites assumées)
11. **Word to PDF** — .docx via mammoth → HTML → rendu PDF. Bandeau d'avertissement : rendu fidèle sur docs simples, mise en page complexe non garantie.

## Architecture

```
src/
  main.tsx
  App.tsx                  // router + layout
  index.css                // import tailwind
  pages/
    Home.tsx               // grille des outils (cartes comme le screen)
    tools/
      MergePdf.tsx
      SplitPdf.tsx
      CompressPdf.tsx
      JpgToPdf.tsx
      PngToPdf.tsx
      PdfToJpg.tsx
      RotatePdf.tsx
      DeletePages.tsx
      PageNumbers.tsx
      Watermark.tsx
      WordToPdf.tsx
  components/
    ToolCard.tsx           // carte de la home
    Dropzone.tsx           // drag & drop réutilisable
    FileList.tsx           // liste fichiers réordonnable
    PageGrid.tsx           // miniatures de pages (sélection, rotation)
    DownloadButton.tsx
    Spinner.tsx
  lib/
    pdf.ts                 // helpers pdf-lib partagés
    render.ts              // helpers pdfjs (page → canvas)
    download.ts            // blob → download, zip
    tools.ts               // registre des outils (titre, desc, icône, route)
```

## Pattern commun à chaque outil

1. Dropzone (drag & drop + bouton fichier)
2. Preview / liste (miniatures si pertinent)
3. Options spécifiques à l'outil
4. Bouton "Traiter" → spinner pendant le travail
5. Bouton télécharger le résultat

Tout le travail dans des fonctions pures dans `lib/`, l'UI ne fait qu'appeler.

## Composants à factoriser dès le départ

- `Dropzone` : accepte un type MIME, multi ou non, renvoie les File
- `FileList` : drag pour réordonner (dnd-kit léger, ou HTML5 drag natif pour rester minimal → natif)
- `PageGrid` : rendu miniatures via pdfjs, sélection multiple, badge rotation

## Déploiement

- `vite.config.ts` avec `base: '/pdftools/'` (ou le nom du repo)
- GitHub Actions pour build + deploy sur gh-pages, comme Skein
- Username GitHub : ely-h

## Workflow git

- Une branche par outil ou par feature. Jamais de dev direct sur main.
- Nommage : feat/<nom-outil> ou chore/<tache>. Ex: feat/merge-pdf, chore/scaffold.
- Commit atomiques sur la branche, puis merge dans main une fois l'étape validée.

## Style

- Reprendre l'esprit du screen : cartes blanches arrondies, ombre douce, icône colorée par outil, titre gras + description grise
- Accent couleur par catégorie (orange pour organisation, vert pour optimisation, bleu pour conversion)
- Sobre, propre, pas de fioritures
- Bandeau de confiance en haut de la home : traitement 100% local


## Hors scope v1 (à noter, ne pas faire)

- PDF to Word : conversion inverse fiable impossible sans serveur
- OCR : Tesseract.js = autre projet
- Signature électronique
- Édition de texte dans le PDF