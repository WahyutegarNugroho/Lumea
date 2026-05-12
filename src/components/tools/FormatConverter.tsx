import { useState, useRef } from 'react';
import { Dropzone } from '../ui/Dropzone';
import { Download, RefreshCw, Layers } from 'lucide-react';
import { useTranslations, type Locale } from '../../lib/i18n';

interface Props {
  lang?: Locale;
}

export default function FormatConverter({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState('image/png');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const convertAndDownload = () => {
    if (!file || !canvasRef.current) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Handle transparency for JPEG (white background)
        if (targetFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
        const extension = targetFormat.split('/')[1];
        const dataUrl = canvas.toDataURL(targetFormat, 0.9);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `lumea-converted-${file.name.split('.')[0]}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Removed immediate revoke
      }
      setIsProcessing(false);
    };
    img.src = preview!;
  };

  if (!file) {
    return <Dropzone onFilesSelected={handleFiles} lang={lang} />;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-bold text-zinc-900 font-outfit uppercase tracking-wider text-sm">{t('ui.selected_image')}</h3>
          <div className="aspect-square bg-zinc-100 rounded-3xl overflow-hidden border border-zinc-200 flex items-center justify-center">
            <img src={preview!} alt="Preview" className="max-w-full max-h-full object-contain" />
          </div>
          <div className="text-center text-sm text-zinc-500 font-medium">
            {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </div>
        </div>

        <div className="space-y-6 flex flex-col justify-center">
          <h3 className="font-bold text-zinc-900 font-outfit uppercase tracking-wider text-sm">{t('ui.target_format')}</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'image/png', label: 'PNG', desc: t('ui.png_desc') },
              { id: 'image/jpeg', label: 'JPG', desc: t('ui.jpg_desc') },
              { id: 'image/webp', label: 'WebP', desc: t('ui.webp_desc') }
            ].map((format) => (
              <button
                key={format.id}
                onClick={() => setTargetFormat(format.id)}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${targetFormat === format.id ? 'border-zinc-900 bg-zinc-900 text-white shadow-xl' : 'border-zinc-100 bg-zinc-50 text-zinc-900 hover:border-zinc-200'}`}
              >
                <div className="font-bold text-lg">{format.label}</div>
                <div className={`text-xs ${targetFormat === format.id ? 'text-zinc-400' : 'text-zinc-500'}`}>{format.desc}</div>
              </button>
            ))}
          </div>

          <div className="pt-6 space-y-3">
            <button 
              onClick={convertAndDownload}
              disabled={isProcessing}
              className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 hover:shadow-zinc-300"
            >
              {isProcessing ? <RefreshCw className="animate-spin" /> : <Layers size={20} />}
              {t('ui.convert_download')}
            </button>
            <button 
              onClick={() => setFile(null)}
              className="w-full py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-bold hover:bg-zinc-50 transition-all"
            >
              {t('ui.select_another')}
            </button>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
