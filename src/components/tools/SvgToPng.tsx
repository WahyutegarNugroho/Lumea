import { withErrorBoundary } from '../ui/withErrorBoundary';
import { useState, useEffect, useRef } from 'react';
import { Dropzone } from '../ui/Dropzone';
import { Download, ShieldCheck, Maximize2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslations } from '../../lib/i18n';
import { useDownload } from '../../lib/hooks/useDownload';
import DOMPurify from 'dompurify';

interface Props {
  lang?: string;
}

function SvgToPng({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const { download } = useDownload();
  const [file, setFile] = useState<File | null>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, originalWidth: 0, originalHeight: 0 });
  const [scale, setScale] = useState(1);
  const readerRef = useRef<FileReader | null>(null);

  useEffect(() => {
    if (file) {
      readerRef.current?.abort();
      const reader = new FileReader();
      readerRef.current = reader;
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          setSvgContent(content);
          
          // Parse dimensions from SVG
          const parser = new DOMParser();
          const doc = parser.parseFromString(content, 'image/svg+xml');
          const svg = doc.querySelector('svg');
          if (svg) {
            const w = parseInt(svg.getAttribute('width') || '512');
            const h = parseInt(svg.getAttribute('height') || '512');
            setDimensions({ width: w, height: h, originalWidth: w, originalHeight: h });
          }
        } catch {
          toast('Failed to parse SVG file');
        }
      };
      reader.onerror = () => toast('Failed to read SVG file');
      reader.readAsText(file);
    }
    return () => {
      readerRef.current?.abort();
      readerRef.current = null;
    };
  }, [file]);

  const handleFiles = (files: File[]) => {
    setFile(files[0]);
  };

  const updateScale = (newScale: number) => {
    setScale(newScale);
    setDimensions(prev => ({
      ...prev,
      width: Math.round(prev.originalWidth * newScale),
      height: Math.round(prev.originalHeight * newScale)
    }));
  };

  const convertToPng = () => {
    if (!svgContent) return;
    setIsProcessing(true);

    const img = new Image();
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
          const pngUrl = canvas.toDataURL('image/png');
          download(pngUrl, `${file?.name.replace('.svg', '') || 'vector'}.png`);
        }
      } catch (err) {
        console.error(err);
        toast('Failed to convert SVG to PNG');
      } finally {
        URL.revokeObjectURL(url);
        setIsProcessing(false);
      }
    };
    img.onerror = () => {
      toast('Failed to load SVG for rendering');
      URL.revokeObjectURL(url);
      setIsProcessing(false);
    };
    img.src = url;
  };

  if (!file) {
    return <Dropzone onFilesSelected={handleFiles} accept=".svg" lang={lang} />;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Preview Area */}
        <div className="space-y-6">
          <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-inner flex items-center justify-center min-h-[400px] overflow-hidden">
            {svgContent ? (
              <div 
                className="max-w-full max-h-[400px] shadow-2xl bg-white dark:bg-zinc-900 rounded-lg p-4"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(svgContent) }}
              />
            ) : (
              <div className="animate-pulse flex flex-col items-center gap-4">
                 <div className="w-16 h-16 bg-zinc-200 rounded-2xl"></div>
                 <div className="w-32 h-4 bg-zinc-200 rounded-full"></div>
              </div>
            )}
          </div>
        </div>

        {/* Controls Area */}
        <div className="space-y-6 flex flex-col justify-center">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center">
                  <Maximize2 size={24} />
               </div>
               <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-lg">{t('ui.output_size')}</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{t('ui.res_adjust_desc')}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label htmlFor="svg-width" className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{t('ui.width_px')}</label>
                  <input 
                    id="svg-width"
                    type="number" 
                    value={dimensions.width}
                    onChange={(e) => {
                      const w = parseInt(e.target.value) || 0;
                      setDimensions(prev => ({ ...prev, width: w, height: Math.round(w * (prev.originalHeight / prev.originalWidth)) }));
                    }}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 font-bold text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-900"
                  />
               </div>
               <div className="space-y-2">
                  <label htmlFor="svg-height" className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{t('ui.height_px')}</label>
                  <input 
                    id="svg-height"
                    type="number" 
                    value={dimensions.height}
                    onChange={(e) => {
                      const h = parseInt(e.target.value) || 0;
                      setDimensions(prev => ({ ...prev, height: h, width: Math.round(h * (prev.originalWidth / prev.originalHeight)) }));
                    }}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 font-bold text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-900"
                  />
               </div>
            </div>

            <div className="flex gap-2">
               {[1, 2, 4, 8].map(s => (
                 <button 
                   key={s}
                   onClick={() => updateScale(s)}
                   className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${scale === s ? 'bg-zinc-900 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200'}`}
                 >
                   {s}x
                 </button>
               ))}
            </div>

            <button 
              onClick={convertToPng}
              disabled={isProcessing}
              className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-2xl shadow-zinc-200 hover:scale-[1.02]"
            >
              {isProcessing ? <RefreshCw size={22} className="animate-spin" /> : <Download size={22} />}
              {t('ui.convert_svg')}
            </button>
          </div>

          <div className="bg--50 dark:bg--900/30 border border--100 dark:border--800/50 rounded-3xl p-6 flex gap-4 items-start">
            <div className="p-2 bg--100 dark:bg--900/40 text--600 dark:text--400 rounded-xl">
               <ShieldCheck size={20} />
            </div>
            <div>
               <h4 className="font-bold text-emerald-900 text-sm mb-1">{t('ui.lossless_rendering')}</h4>
               <p className="text-emerald-700/70 text-xs leading-relaxed">
                 {t('ui.svg_privacy_desc')}
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withErrorBoundary(SvgToPng);
