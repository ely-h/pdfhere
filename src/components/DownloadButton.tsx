import { downloadBlob } from '../lib/download'
import { IconDownload } from './Icons'

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
      className="btn-primary"
      style={{ padding: '15px 30px' }}
    >
      <IconDownload />
      Télécharger
    </button>
  )
}
