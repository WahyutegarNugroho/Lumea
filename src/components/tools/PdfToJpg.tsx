import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Dropzone } from '../ui/Dropzone';
import { FileImage, FileText, Layers, ShieldCheck } from 'lucide-react';
import { useTranslations, type Locale } from '../../lib/i18n';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface Props {
  lang?: Locale;
}

export default function PdfToJpg({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  
  const handleFiles = (files: File[]) => {
    setFile(files[0]);
  };

  const convertToJpg = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      setProgress({ current: 0, total: totalPages });

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for better quality
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context as any, viewport } as any).promise;
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `lumea-page-${i}-${file.name.replace('.pdf', '')}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        
        setProgress(prev => ({ ...prev, current: i }));
      }
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* File Card */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-[2.5rem] p-10 text-center flex flex-col items-center justify-center space-y-6 shadow-inner">
          <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-[2rem] flex items-center justify-center shadow-xl shadow-rose-100/50">
            <FileText size={48} />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-zinc-900 font-outfit truncate max-w-xs">{file.name}</h3>
            <p className="text-zinc-500 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB • {t('ui.ready_to_convert')}</p>
          </div>

          {!isProcessing ? (
            <div className="w-full pt-4 space-y-3">
              <button 
                onClick={convertToJpg}
                className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-2xl shadow-zinc-200 hover:scale-[1.02]"
              >
                <Layers size={22} />
                {t('ui.convert_to_jpg')}
              </button>
              <button 
                onClick={() => setFile(null)}
                className="w-full py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-bold hover:bg-zinc-50 transition-all text-sm"
              >
                {t('ui.change_pdf')}
              </button>
            </div>
          ) : (
            <div className="w-full space-y-4 pt-4">
              <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                <span>{t('ui.processing_pages')}</span>
                <span>{progress.current} / {progress.total}</span>
              </div>
              <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-zinc-900 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-zinc-400 italic leading-relaxed">{t('ui.browser_downloading')}</p>
            </div>
          )}
        </div>

        {/* Feature Info */}
        <div className="space-y-6 flex flex-col justify-center">
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shrink-0">
                <FileImage size={24} />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-zinc-900 text-lg">{t('ui.high_quality_conv')}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {t('ui.high_quality_conv_desc')}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 flex gap-5">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-emerald-900 text-lg">{t('ui.local_secure')}</h4>
                <p className="text-emerald-700/70 text-sm leading-relaxed">
                  {t('ui.pdf_to_jpg_privacy_desc')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-8 text-white relative overflow-hidden">
             <div className="relative z-10 space-y-3">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{t('ui.pro_tip')}</h5>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {t('ui.pdf_to_jpg_pro_tip')}
                </p>
             </div>
             <Layers className="absolute -bottom-8 -right-8 w-32 h-32 text-white/5 -rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
