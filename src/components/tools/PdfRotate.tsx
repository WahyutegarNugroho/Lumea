import { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { Dropzone } from '../ui/Dropzone';
import { Download, RotateCw, FileText } from 'lucide-react';
import { useTranslations, type Locale } from '../../lib/i18n';

interface Props {
  lang?: Locale;
}

export default function PdfRotate({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = (files: File[]) => {
    setFile(files[0]);
  };

  const rotatePdf = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPages();
      
      pages.forEach(page => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + rotation) % 360));
      });

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lumea-rotated-${file.name.replace('.pdf', '')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Removed immediate revoke
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!file) {
    return <Dropzone onFilesSelected={handleFiles} accept="application/pdf" lang={lang} />;
  }

  return (
    <div className="space-y-8">
      <div className="max-w-md mx-auto text-center space-y-8">
        <div className="relative inline-block transition-transform duration-500" style={{ transform: `rotate(${rotation}deg)` }}>
          <div className="w-48 h-64 bg-white border-2 border-zinc-200 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4">
              <FileText size={24} />
            </div>
            <div className="text-sm font-bold text-zinc-900 truncate w-full">{file.name}</div>
          </div>
          
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
            {rotation}°
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setRotation((rotation - 90 + 360) % 360)}
            className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all"
          >
            <RotateCw size={20} className="scale-x-[-1]" />
            {t('ui.rotate_left')}
          </button>
          <button 
            onClick={() => setRotation((rotation + 90) % 360)}
            className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all"
          >
            <RotateCw size={20} />
            {t('ui.rotate_right')}
          </button>
        </div>

        <div className="pt-4 space-y-4">
          <button 
            onClick={rotatePdf}
            disabled={isProcessing}
            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
          >
            {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Download size={20} />}
            {t('ui.save_download')}
          </button>
          <button 
            onClick={() => setFile(null)}
            className="w-full py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-bold hover:bg-zinc-50 transition-all"
          >
            {t('ui.select_another_file')}
          </button>
        </div>
      </div>
    </div>
  );
}
