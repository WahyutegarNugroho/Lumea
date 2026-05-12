import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Dropzone } from '../ui/Dropzone';
import { Scissors, CheckCircle2, Plus, X, Layers, Grid, ShieldCheck } from 'lucide-react';
import { useTranslations, type Locale } from '../../lib/i18n';

// Use a more stable worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface Props {
  lang?: Locale;
}

interface PagePreview {
  index: number;
  dataUrl: string;
}

export default function PdfSplit({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const [file, setFile] = useState<File | null>(null);
  const [previews, setPreviews] = useState<PagePreview[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [ranges, setRanges] = useState<{from: number, to: number}[]>([{from: 1, to: 1}]);
  const [mode, setMode] = useState<'range' | 'extract'>('range');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const handleFiles = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    generatePreviews(selectedFile);
  };

  const generatePreviews = async (file: File) => {
    setIsPreviewLoading(true);
    setPreviews([]);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;
      setRanges([{from: 1, to: totalPages}]);
      
      const newPreviews: PagePreview[] = [];
      const numToPreview = Math.min(totalPages, 20); // Show up to 20 pages for speed
      
      for (let i = 1; i <= numToPreview; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        if (context) {
          await page.render({ canvasContext: context as any, viewport } as any).promise;
          newPreviews.push({ index: i, dataUrl: canvas.toDataURL('image/webp', 0.6) });
          // Update previews incrementally for better UX
          if (i % 5 === 0 || i === numToPreview) {
            setPreviews([...newPreviews]);
          }
        }
      }
      if (newPreviews.length > 0) setPreviews(newPreviews);
    } catch (error) {
      console.error('Preview error:', error);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const togglePageSelection = (index: number) => {
    setSelectedPages(prev => 
      prev.includes(index) ? prev.filter(p => p !== index) : [...prev, index].sort((a,b) => a-b)
    );
  };

  const addRange = () => {
    const lastRange = ranges[ranges.length - 1];
    setRanges([...ranges, { from: lastRange.to + 1, to: lastRange.to + 1 }]);
  };

  const removeRange = (index: number) => {
    setRanges(ranges.filter((_, i) => i !== index));
  };

  const splitPdf = async () => {
    if (!file) return;
    if (mode === 'extract' && selectedPages.length === 0) {
      alert(t('ui.error_select_page'));

      return;
    }
    
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      let pagesToExtract: number[] = [];

      if (mode === 'range') {
        ranges.forEach(r => {
          for (let i = r.from; i <= r.to; i++) {
            if (i > 0 && i <= pdf.getPageCount()) pagesToExtract.push(i - 1);
          }
        });
      } else {
        pagesToExtract = selectedPages.map(p => p - 1);
      }

      if (pagesToExtract.length === 0) {
        throw new Error('No pages selected for extraction');
      }

      const copiedPages = await newPdf.copyPages(pdf, pagesToExtract);
      copiedPages.forEach(p => newPdf.addPage(p));
      
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `lumea_split_result.pdf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      
      setTimeout(() => {
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          setIsProcessing(false);
        }, 3000);
      }, 100);

    } catch (error) {
      console.error('Split error:', error);
      alert(`${t('ui.error_split_failed')}: ${error instanceof Error ? error.message : t('ui.error_unknown')}`);

      setIsProcessing(false);
    }
  };

  if (!file) {
    return <Dropzone onFilesSelected={handleFiles} accept="application/pdf" lang={lang} />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
      {/* Left Area: Page Previews */}
      <div className="flex-1 bg-zinc-100 rounded-[2rem] p-6 overflow-y-auto max-h-[800px] border border-zinc-200 shadow-inner relative">
        {isPreviewLoading && previews.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-100/50 backdrop-blur-sm z-20">
            <div className="w-10 h-10 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold text-zinc-500 animate-pulse">{t('ui.generating_previews')}</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {previews.map((preview) => (
            <div 
              key={preview.index}
              onClick={() => mode === 'extract' && togglePageSelection(preview.index)}
              className={`relative aspect-[1/1.4] bg-white rounded-xl border-2 transition-all cursor-pointer group ${
                mode === 'extract' && selectedPages.includes(preview.index) 
                  ? 'border-zinc-900 ring-4 ring-zinc-900/10 scale-105 z-10' 
                  : 'border-transparent hover:border-zinc-300'
              }`}
            >
              <img src={preview.dataUrl} className="w-full h-full object-contain rounded-lg" alt={`${t('ui.page')} ${preview.index}`} />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-zinc-900/80 backdrop-blur-sm text-white text-[10px] font-bold rounded-md">
                {preview.index}
              </div>
              {mode === 'extract' && (
                <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedPages.includes(preview.index) ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white/80 border-zinc-200'
                }`}>
                  {selectedPages.includes(preview.index) && <CheckCircle2 size={14} />}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Area: Controls Sidebar */}
      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex p-1 bg-zinc-100 rounded-2xl">
            <button 
              onClick={() => setMode('range')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${mode === 'range' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              <Layers size={14} />
              {t('ui.split_range')}
            </button>
            <button 
              onClick={() => setMode('extract')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${mode === 'extract' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              <Grid size={14} />
              {t('ui.extract_pages')}
            </button>
          </div>

          <div className="space-y-4">
            {mode === 'range' ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="tool-label m-0">{t('ui.split_range')}</label>
                  <button onClick={addRange} className="p-1.5 bg-zinc-100 text-zinc-900 rounded-lg hover:bg-zinc-200 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
                {ranges.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
                    <input 
                      type="number" 
                      value={r.from} 
                      onChange={(e) => {
                        const newRanges = [...ranges];
                        newRanges[i].from = parseInt(e.target.value) || 1;
                        setRanges(newRanges);
                      }}
                      className="w-14 bg-white border border-zinc-200 rounded-lg p-1.5 text-center text-sm font-bold"
                    />
                    <span className="text-zinc-400">{t('ui.to')}</span>
                    <input 
                      type="number" 
                      value={r.to}
                      onChange={(e) => {
                        const newRanges = [...ranges];
                        newRanges[i].to = parseInt(e.target.value) || 1;
                        setRanges(newRanges);
                      }}
                      className="w-14 bg-white border border-zinc-200 rounded-lg p-1.5 text-center text-sm font-bold"
                    />
                    {ranges.length > 1 && (
                      <button onClick={() => removeRange(i)} className="text-zinc-300 hover:text-rose-500 p-1">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">{t('ui.select_pages')}</div>
                <div className="text-3xl font-bold text-zinc-900 font-outfit">
                  {selectedPages.length} <span className="text-sm text-zinc-400">{t('ui.pages_selected')}</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 space-y-3 border-t border-zinc-100">
            <button 
              onClick={splitPdf}
              disabled={isProcessing || (mode === 'extract' && selectedPages.length === 0)}
              className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
            >
              {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Scissors size={20} />}
              {isProcessing ? t('ui.splitting_pdfs') : t('ui.split_pdf')}
            </button>
            <button onClick={() => setFile(null)} className="w-full py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-bold hover:bg-zinc-50 transition-all text-sm">
              {t('ui.change_pdf')}
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
           <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">{t('ui.privacy_shield')}</span>
              </div>
              <h4 className="text-xl font-bold font-outfit">{t('ui.pro_tip')}</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {t('ui.split_privacy_desc')}
              </p>
           </div>
           <Scissors className="absolute -bottom-8 -right-8 w-32 h-32 text-white/5 -rotate-12" />
        </div>
      </div>
    </div>
  );
}
