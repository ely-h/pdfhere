import { ImagesToPdfTool } from '../../components/ImagesToPdfTool'

export default function JpgToPdf() {
  return (
    <ImagesToPdfTool
      accept="image/jpeg,image/jpg"
      title="JPG to PDF"
      subtitle="Glisse tes JPG pour les réordonner."
      label="JPG"
    />
  )
}
