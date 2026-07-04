export type Category = 'Organiser' | 'Optimiser' | 'Convertir'

export type IconId =
  | 'merge'
  | 'split'
  | 'rotate'
  | 'delete'
  | 'compress'
  | 'page-numbers'
  | 'watermark'
  | 'img-to-pdf'
  | 'pdf-to-img'
  | 'word-to-pdf'

export interface Tool {
  id: string
  title: string
  description: string
  icon: IconId
  route: string
  category: Category
  hot?: boolean
  live?: boolean
}

export const CATEGORIES: Category[] = ['Organiser', 'Optimiser', 'Convertir']

export const CATEGORY_COUNTS: Record<Category, number> = {
  Organiser: 4,
  Optimiser: 3,
  Convertir: 4,
}

export const TOOLS: Tool[] = [
  {
    id: 'merge',
    title: 'Merge PDF',
    description: 'Fusionner plusieurs PDF',
    icon: 'merge',
    route: '/merge',
    category: 'Organiser',
    hot: true,
    live: true,
  },
  {
    id: 'split',
    title: 'Split PDF',
    description: 'Extraire une plage de pages',
    icon: 'split',
    route: '/split',
    category: 'Organiser',
    live: true,
  },
  {
    id: 'rotate',
    title: 'Rotate PDF',
    description: 'Pivoter pages ou document',
    icon: 'rotate',
    route: '/rotate',
    category: 'Organiser',
  },
  {
    id: 'delete-pages',
    title: 'Delete pages',
    description: 'Supprimer les pages choisies',
    icon: 'delete',
    route: '/delete-pages',
    category: 'Organiser',
  },
  {
    id: 'compress',
    title: 'Compress PDF',
    description: 'Réduire la taille du fichier',
    icon: 'compress',
    route: '/compress',
    category: 'Optimiser',
    live: true,
  },
  {
    id: 'page-numbers',
    title: 'Page numbers',
    description: 'Ajouter des numéros',
    icon: 'page-numbers',
    route: '/page-numbers',
    category: 'Optimiser',
  },
  {
    id: 'watermark',
    title: 'Watermark',
    description: 'Filigrane texte',
    icon: 'watermark',
    route: '/watermark',
    category: 'Optimiser',
  },
  {
    id: 'jpg-to-pdf',
    title: 'JPG to PDF',
    description: 'Images → un PDF',
    icon: 'img-to-pdf',
    route: '/jpg-to-pdf',
    category: 'Convertir',
  },
  {
    id: 'png-to-pdf',
    title: 'PNG to PDF',
    description: 'Images → un PDF',
    icon: 'img-to-pdf',
    route: '/png-to-pdf',
    category: 'Convertir',
  },
  {
    id: 'pdf-to-jpg',
    title: 'PDF to JPG',
    description: 'Chaque page en image',
    icon: 'pdf-to-img',
    route: '/pdf-to-jpg',
    category: 'Convertir',
  },
  {
    id: 'word-to-pdf',
    title: 'Word to PDF',
    description: '.docx → PDF · bonus',
    icon: 'word-to-pdf',
    route: '/word-to-pdf',
    category: 'Convertir',
  },
]
