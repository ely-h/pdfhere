import { downloadBlob } from '../lib/download'

interface DownloadButtonProps {
  blob: Blob | null
  filename: string
}

export function DownloadButton({ blob, filename }: DownloadButtonProps) {
  return (
    <button
      type="button"
      disabled={blob === null}
      onClick={() => { if (blob) downloadBlob(blob, filename) }}
      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm disabled:opacity-40 hover:bg-blue-700 transition-colors"
    >
      Télécharger
    </button>
  )
}
