# CLAUDE.md

Contexte et règles pour bosser sur ce projet avec Claude Code.

## Le projet

Boîte à outils PDF qui tourne 100% dans le navigateur. Aucun serveur, aucun upload, les fichiers ne quittent jamais la machine. Inspiré d'iLovePDF mais sans le côté "on envoie tes fichiers sur nos serveurs". C'est l'argument central : tout est local.

Hébergé sur GitHub Pages. Username GitHub : ely-h.

## Stack imposée

- Vite + React 19 + TypeScript strict
- Tailwind v4 (import unique dans index.css, pas de tailwind.config.js)
- react-router-dom, une route par outil
- Pas de state global. State local par page. Pas de Zustand, pas de Redux.
- Le moins de dépendances possible. Avant d'ajouter une lib, vérifier qu'elle est vraiment nécessaire.

### Libs de traitement (lazy-load par outil via dynamic import)

- pdf-lib : manipulation PDF (merge, split, rotate, delete, watermark, numéros, images→PDF, chiffrement)
- pdfjs-dist : rendu PDF→canvas (PDF→JPG, extraction images, miniatures)
- mammoth : .docx → HTML pour Word→PDF

La home doit rester légère : aucune lib de traitement chargée tant qu'on n'ouvre pas un outil.

## Règles de code

- TypeScript strict, pas de `any`. Si un type de lib externe manque, le déclarer proprement.
- Toute la logique de traitement PDF vit dans `src/lib/`, en fonctions pures testables. L'UI appelle ces fonctions, elle ne fait pas de traitement elle-même.
- Composants factorisés dès le départ : Dropzone, FileList, PageGrid, DownloadButton, Spinner. Ne pas réécrire un dropzone dans chaque outil.
- Drag & drop pour réordonner : HTML5 natif d'abord. N'ajouter dnd-kit que si le natif devient ingérable.
- Gérer les erreurs : PDF corrompu, fichier non-PDF, PDF chiffré sans mot de passe. Message clair à l'user, pas de crash.
- Spinner pendant tout traitement lourd. Bloquer le bouton pendant le travail.

## Pattern de chaque outil

1. Dropzone
2. Preview / liste (miniatures si pertinent)
3. Options spécifiques
4. Bouton traiter → spinner
5. Bouton télécharger

## Compress PDF — logique

Pas de Ghostscript (impossible en client léger). Approche hybride cachée derrière un curseur unique :
- Détecter les images du PDF
- Ré-encoder les images via canvas en JPEG qualité réglée par le curseur
- Nettoyer/recompresser les streams avec pdf-lib
- Sur PDF texte sans image : nettoyage pdf-lib seul, gain faible, c'est normal

## Word to PDF — limites assumées

mammoth parse le .docx en HTML, puis rendu en PDF. Afficher un bandeau clair : rendu correct sur docs simples, mise en page complexe non garantie. Ne pas survendre.

## Hors scope — ne pas implémenter

- PDF to Word (impossible proprement sans serveur)
- OCR
- Signature électronique
- Édition de texte dans le PDF

Si une de ces idées revient, le dire et proposer une alternative, ne pas se lancer.

## Préférences de l'autrice (Elyssa)

- Communication en français, direct, sans blabla.
- Pas de tirets cadratins (—) ni longs tirets dans le code, les commentaires ou les textes UI.
- Pas de phrasé qui sonne IA, pas de remplissage motivant. Phrases courtes.
- Corriger les vraies erreurs sans hésiter, ne pas flatter.
- Patches ciblés quand on modifie : ne pas réécrire un fichier entier pour changer trois lignes.

## Style visuel

- Cartes blanches arrondies, ombre douce, icône colorée par outil, titre gras, description grise.
- Accent couleur par catégorie : orange (organiser), vert (optimiser), bleu (convertir).
- Sobre et propre. Bandeau de confiance en home : traitement 100% local.

## Déploiement

- `base` dans vite.config.ts = nom du repo.
- GitHub Actions build + deploy sur gh-pages.
- Remote double GitLab/GitHub possible comme d'habitude, miroir GitHub username ely-h.

## Workflow Git

- Commits clairs et atomiques, un outil ou une feature par commit.
- Pas de commit de node_modules ni de dist.
- Une branche par outil ou par feature. Jamais de dev direct sur main.
- Nommage : feat/<nom-outil> ou chore/<tache>. Ex: feat/merge-pdf, chore/scaffold.
- Commit atomiques sur la branche, puis merge dans main une fois l'étape validée.