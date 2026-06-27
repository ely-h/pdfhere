import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MergePdf from './pages/tools/MergePdf'
import SplitPdf from './pages/tools/SplitPdf'
import CompressPdf from './pages/tools/CompressPdf'
import JpgToPdf from './pages/tools/JpgToPdf'
import PngToPdf from './pages/tools/PngToPdf'
import PdfToJpg from './pages/tools/PdfToJpg'
import RotatePdf from './pages/tools/RotatePdf'
import DeletePages from './pages/tools/DeletePages'
import PageNumbers from './pages/tools/PageNumbers'
import Watermark from './pages/tools/Watermark'
import WordToPdf from './pages/tools/WordToPdf'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/merge" element={<MergePdf />} />
        <Route path="/split" element={<SplitPdf />} />
        <Route path="/compress" element={<CompressPdf />} />
        <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
        <Route path="/png-to-pdf" element={<PngToPdf />} />
        <Route path="/pdf-to-jpg" element={<PdfToJpg />} />
        <Route path="/rotate" element={<RotatePdf />} />
        <Route path="/delete-pages" element={<DeletePages />} />
        <Route path="/page-numbers" element={<PageNumbers />} />
        <Route path="/watermark" element={<Watermark />} />
        <Route path="/word-to-pdf" element={<WordToPdf />} />
      </Routes>
    </HashRouter>
  )
}
