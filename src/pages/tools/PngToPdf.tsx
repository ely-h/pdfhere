import { ImagesToPdfTool } from '../../components/ImagesToPdfTool'

export default function PngToPdf() {
  return (
    <ImagesToPdfTool
      accept="image/png"
      title="PNG to PDF"
      subtitle="Glisse tes PNG pour les réordonner."
      label="PNG"
    />
  )
}
