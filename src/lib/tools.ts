export type Category = 'Organiser' | 'Optimiser' | 'Convertir'

export interface Tool {
  id: string
  title: string
  description: string
  icon: string
  route: string
  category: Category
}

export const CATEGORIES: Category[] = ['Organiser', 'Optimiser', 'Convertir']

export const CATEGORY_COLOR: Record<Category, { bg: string; badge: string }> = {
  Organiser: { bg: 'bg-orange-50', badge: 'bg-orange-100 text-orange-700' },
  Optimiser: { bg: 'bg-green-50', badge: 'bg-green-100 text-green-700' },
  Convertir: { bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
}

export const TOOLS: Tool[] = [
  {
    id: 'merge',
    title: 'Fusionner PDF',
    description: 'Combine plusieurs fichiers PDF en un seul, dans l\'ordre voulu.',
    icon: '🔀',
    route: '/merge',
    category: 'Organiser',
  },
  {
    id: 'split',
    title: 'Diviser PDF',
    description: 'Extrait une plage de pages ou éclate un PDF en fichiers séparés.',
    icon: '✂️',
    route: '/split',
    category: 'Organiser',
  },
  {
    id: 'rotate',
    title: 'Rotation PDF',
    description: 'Pivote des pages individuellement ou tout le document.',
    icon: '🔄',
    route: '/rotate',
    category: 'Organiser',
  },
  {
    id: 'delete-pages',
    title: 'Supprimer des pages',
    description: 'Supprime les pages sélectionnées d\'un PDF.',
    icon: '🗑️',
    route: '/delete-pages',
    category: 'Organiser',
  },
  {
    id: 'page-numbers',
    title: 'Numéros de page',
    description: 'Ajoute des numéros de page configurables (position, format).',
    icon: '🔢',
    route: '/page-numbers',
    category: 'Organiser',
  },
  {
    id: 'watermark',
    title: 'Filigrane',
    description: 'Ajoute un texte en filigrane sur chaque page (opacité, angle).',
    icon: '💧',
    route: '/watermark',
    category: 'Organiser',
  },
  {
    id: 'compress',
    title: 'Compresser PDF',
    description: 'Réduit la taille du fichier en optimisant les images intégrées.',
    icon: '🗜️',
    route: '/compress',
    category: 'Optimiser',
  },
  {
    id: 'jpg-to-pdf',
    title: 'JPG vers PDF',
    description: 'Convertit une ou plusieurs images JPG en un seul PDF.',
    icon: '🖼️',
    route: '/jpg-to-pdf',
    category: 'Convertir',
  },
  {
    id: 'png-to-pdf',
    title: 'PNG vers PDF',
    description: 'Convertit une ou plusieurs images PNG en un seul PDF.',
    icon: '🖼️',
    route: '/png-to-pdf',
    category: 'Convertir',
  },
  {
    id: 'pdf-to-jpg',
    title: 'PDF vers JPG',
    description: 'Exporte chaque page du PDF en image JPG, téléchargeables en zip.',
    icon: '📷',
    route: '/pdf-to-jpg',
    category: 'Convertir',
  },
  {
    id: 'word-to-pdf',
    title: 'Word vers PDF',
    description: 'Convertit un fichier .docx en PDF directement dans le navigateur.',
    icon: '📝',
    route: '/word-to-pdf',
    category: 'Convertir',
  },
]
