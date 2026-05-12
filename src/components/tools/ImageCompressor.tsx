import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { Dropzone } from '../ui/Dropzone';
import { Download, Shrink, FileImage, CheckCircle2, Loader2, X } from 'lucide-react';
import { useTranslations, type Locale } from '../../lib/i18n';

interface Props {
  lang?: Locale;
}

interface CompressedFile {
  file: File;
  originalSize: number;
  compressedSize: number;
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export default function ImageCompressor({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const [files, setFiles] = useState<CompressedFile[]>([]);
  const [quality, setQuality] = useState(0.8);
  const [isProcessingAll, setIsProcessingAll] = useState(false);

  const handleFiles = (newFiles: File[]) => {
    const formatted = newFiles.map(f => ({
      file: f,
      originalSize: f.size,
      compressedSize: 0,
      url: '',
      status: 'pending' as const
    }));
    setFiles(prev => [...prev, ...formatted]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const compressAll = async () => {
    setIsProcessingAll(true);
    
    const updatedFiles = [...files];
    
    for (let i = 0; i < updatedFiles.length; i++) {
      if (updatedFiles[i].status === 'completed') continue;
      
      try {
        updatedFiles[i].status = 'processing';
        setFiles([...updatedFiles]);

        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          initialQuality: quality,
        };

        const compressedFile = await imageCompression(updatedFiles[i].file, options);
        
        updatedFiles[i].compressedSize = compressedFile.size;
        updatedFiles[i].url = URL.createObjectURL(compressedFile);
        updatedFiles[i].status = 'completed';
        setFiles([...updatedFiles]);
      } catch (error) {
        console.error(error);
        updatedFiles[i].status = 'error';
        setFiles([...updatedFiles]);
      }
    }
    
    setIsProcessingAll(false);
  };

  return (
    <div className="space-y-8">
      {files.length === 0 ? (
        <Dropzone onFilesSelected={handleFiles} accept="image/*" multiple={true} lang={lang} />
      ) : (
        <div className="space-y-6">
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-zinc-900 flex items-center gap-2 uppercase tracking-wider text-sm">
                <FileImage size={18} />
                {t('tool.compressor.title')} ({files.length})
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase">{t('ui.settings')}</span>
                  <input 
                    type="range" min="0.1" max="1" step="0.1" value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="accent-zinc-900 w-24"
                  />
                  <span className="text-xs font-bold text-zinc-900 w-8">{Math.round(quality * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {files.map((item, index) => (
                <div key={`${item.file.name}-${index}`} className="bg-white border border-zinc-100 rounded-2xl p-4 flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-zinc-50 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-100">
                    <img src={URL.createObjectURL(item.file)} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-zinc-900 truncate">{item.file.name}</div>
                    <div className="text-[10px] text-zinc-400 font-medium">
                      {(item.originalSize / 1024).toFixed(1)} KB 
                      {item.compressedSize > 0 && ` → ${(item.compressedSize / 1024).toFixed(1)} KB`}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {item.status === 'processing' && <Loader2 size={16} className="animate-spin text-zinc-400" />}
                    {item.status === 'completed' && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          -{Math.round((1 - item.compressedSize / item.originalSize) * 100)}%
                        </span>
                        <button 
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = item.url;
                            link.download = `lumea-compressed-${item.file.name}`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    )}
                    <button onClick={() => removeFile(index)} className="text-zinc-300 hover:text-rose-500 transition-colors">
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={compressAll}
              disabled={isProcessingAll || files.every(f => f.status === 'completed')}
              className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
            >
              {isProcessingAll ? <Loader2 size={20} className="animate-spin" /> : <Shrink size={20} />}
              {t('tool.compressor.title')}
            </button>
            <button 
              onClick={() => setFiles([])}
              className="px-8 py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-bold hover:bg-zinc-50 transition-all"
            >
              {t('ui.clear')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
