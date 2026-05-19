import { withErrorBoundary } from '../ui/withErrorBoundary';
import { useState, useRef } from 'react';
import { Dropzone } from '../ui/Dropzone';
import { RefreshCw, Layers } from 'lucide-react';
import { useTranslations } from '../../lib/i18n';
import { downloadFile } from '../../lib/utils';

interface Props {
  lang?: string;
}

function FormatConverter({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState('png');
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = (files: File[]) => {
    setFile(files[0]);
  };

  const convert = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      await new Promise((resolve) => img.onload = resolve);

      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        
        const dataUrl = canvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : format}`);
        downloadFile(dataUrl, `converted-${file.name.split('.')[0]}.${format}`);
      }
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!file) {
    return <Dropzone onFilesSelected={handleFiles} accept="image/*" lang={lang} />;
  }

  return (
    <div className="space-y-8">
      <canvas ref={canvasRef} className="hidden" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-8 flex items-center justify-center min-h-[400px]">
          <img src={URL.createObjectURL(file)} className="max-h-[500px] w-auto shadow-lg rounded-lg" alt="Original" />
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Layers size={18} />
              {t('ui.output_format')}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {['png', 'jpg', 'webp'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`py-3 rounded-xl font-bold transition-all border-2 ${
                    format === f 
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-lg' 
                      : 'border-transparent bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button 
              onClick={convert}
              disabled={isProcessing}
              className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
            >
              {isProcessing ? <RefreshCw size={20} className="animate-spin" /> : <RefreshCw size={20} />}
              {t('tool.format-converter.title')}
            </button>
            <button 
              onClick={() => setFile(null)}
              className="w-full py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-bold hover:bg-zinc-50 transition-all"
            >
              {t('ui.clear')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withErrorBoundary(FormatConverter);
