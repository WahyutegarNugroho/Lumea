import { useState, useRef, useEffect } from 'react';
import { Dropzone } from '../ui/Dropzone';
import { Download, Maximize, RefreshCw, Lock, Unlock } from 'lucide-react';
import { useTranslations, type Locale } from '../../lib/i18n';

interface Props {
  lang?: Locale;
}

export default function ImageResizer({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [newSize, setNewSize] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isLocked, setIsLocked] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFiles = (files: File[]) => {
    const selectedFile = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setFile(selectedFile);
        setOriginalSize({ width: img.width, height: img.height });
        setNewSize({ width: img.width, height: img.height });
        setAspectRatio(img.width / img.height);
        imgRef.current = img;
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleWidthChange = (width: number) => {
    if (isLocked) {
      setNewSize({ width, height: Math.round(width / aspectRatio) });
    } else {
      setNewSize({ ...newSize, width });
    }
  };

  const handleHeightChange = (height: number) => {
    if (isLocked) {
      setNewSize({ width: Math.round(height * aspectRatio), height });
    } else {
      setNewSize({ ...newSize, height });
    }
  };

  const resizeAndDownload = () => {
    if (!imgRef.current || !canvasRef.current) return;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    canvas.width = newSize.width;
    canvas.height = newSize.height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(imgRef.current, 0, 0, newSize.width, newSize.height);
      const dataUrl = canvas.toDataURL(file?.type || 'image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `lumea-resized-${file?.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    setIsProcessing(false);
  };

  if (!file) {
    return <Dropzone onFilesSelected={handleFiles} lang={lang} />;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-bold text-zinc-900 font-outfit uppercase tracking-wider text-sm">{t('ui.image_preview')}</h3>
          <div className="aspect-video bg-zinc-100 rounded-3xl overflow-hidden border border-zinc-200 flex items-center justify-center">
            <img 
              src={imgRef.current?.src} 
              alt={t('ui.preview')} 
              className="max-w-full max-h-full object-contain" 
            />
          </div>
          <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-widest px-2">
            <span>{t('ui.original')}: {originalSize.width} × {originalSize.height} px</span>
            <span>{t('ui.type')}: {file.type.split('/')[1].toUpperCase()}</span>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-bold text-zinc-900 font-outfit uppercase tracking-wider text-sm">{t('ui.resize_dimensions')}</h3>
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6 relative">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('ui.width_px')}</label>
                <input 
                  type="number" 
                  value={newSize.width} 
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-zinc-200 rounded-xl p-3 font-bold text-zinc-900 focus:ring-2 focus:ring-zinc-900/5 outline-none"
                />
              </div>
              
              <div className="flex items-end justify-center pb-3">
                <button 
                  onClick={() => setIsLocked(!isLocked)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isLocked ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg' : 'bg-white border-zinc-200 text-zinc-400'}`}
                  title={isLocked ? t('ui.aspect_ratio_unlock') : t('ui.aspect_ratio_lock')}
                >
                  {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('ui.height_px')}</label>
                <input 
                  type="number" 
                  value={newSize.height} 
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-zinc-200 rounded-xl p-3 font-bold text-zinc-900 focus:ring-2 focus:ring-zinc-900/5 outline-none"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <button 
                onClick={resizeAndDownload}
                disabled={isProcessing}
                className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 hover:shadow-zinc-300"
              >
                {isProcessing ? <RefreshCw className="animate-spin" /> : <Maximize size={20} />}
                {t('ui.resize_download')}
              </button>
              <button 
                onClick={() => setFile(null)}
                className="w-full py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-bold hover:bg-zinc-50 transition-all text-sm"
              >
                {t('ui.choose_different')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
