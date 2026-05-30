import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { Dropzone } from '../ui/Dropzone';
import { Download, Shrink, FileImage, Loader2, X } from 'lucide-react';
import { useTranslations } from '../../lib/i18n';
import toast from 'react-hot-toast';
import { withErrorBoundary } from '../ui/withErrorBoundary';
import { useDownload } from '../../lib/hooks/useDownload';

interface Props {
  lang?: string;
}

interface CompressedFile {
  file: File;
  originalSize: number;
  compressedSize: number;
  url: string;
  previewUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

function ImageCompressor({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const { download } = useDownload();
  const [files, setFiles] = useState<CompressedFile[]>([]);
  const [quality, setQuality] = useState(0.8);
  const [isProcessingAll, setIsProcessingAll] = useState(false);


  const handleFiles = (newFiles: File[]) => {
    const formatted = newFiles.map(f => ({
      file: f,
      originalSize: f.size,
      compressedSize: 0,
      url: '',
      previewUrl: URL.createObjectURL(f), // Buat SATU KALI saat state diinisiasi, bukan di dalam render!
      status: 'pending' as const
    }));
    setFiles(prev => [...prev, ...formatted]);
  };

  const removeFile = (index: number) => {
    const item = files[index];
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    if (item.url) URL.revokeObjectURL(item.url);
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    files.forEach(f => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      if (f.url) URL.revokeObjectURL(f.url);
    });
    setFiles([]);
  };

  const compressAll = async () => {
    setIsProcessingAll(true);
    let successCount = 0;
    
    const updatedFiles = [...files];
    
    const processingToast = toast.loading(t('ui.compressing') || "Compressing images...");
    
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
        successCount++;
      } catch (error) {
        console.error(error);
        updatedFiles[i].status = 'error';
        setFiles([...updatedFiles]);
      }
    }
    
    setIsProcessingAll(false);
    
    if (successCount > 0) {
      const msg = successCount === 1
        ? (t('ui.image_compressed') || "Image compressed")
        : `${successCount} ${t('ui.images_compressed') || "images compressed"}`;
      toast.success(msg, { id: processingToast });
    } else {
      toast.error(t('ui.error_compress_failed') || "Compression failed", { id: processingToast });
    }
  };

  return (
    <div className="space-y-8">
      {files.length === 0 ? (
        <Dropzone onFilesSelected={handleFiles} accept="image/*" multiple={true} lang={lang} />
      ) : (
        <div className="space-y-6">
          <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2 uppercase tracking-wider text-sm">
                <FileImage size={18} />
                {t('tool.compressor.title')} ({files.length})
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="img-quality" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">{t('ui.settings')}</label>
                  <input 
                    id="img-quality"
                    type="range" min="0.1" max="1" step="0.1" value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="accent-zinc-900 dark:accent-zinc-100 w-24"
                  />
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 w-8">{Math.round(quality * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {files.map((item, index) => (
                <div key={`${item.file.name}-${index}`} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-950 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-100 dark:border-zinc-800">
                    <img src={item.previewUrl} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">{item.file.name}</div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                      {(item.originalSize / 1024).toFixed(1)} KB 
                      {item.compressedSize > 0 && ` → ${(item.compressedSize / 1024).toFixed(1)} KB`}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {item.status === 'processing' && <Loader2 size={16} className="animate-spin text-zinc-500 dark:text-zinc-400" />}
                    {item.status === 'completed' && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                          -{Math.round((1 - item.compressedSize / item.originalSize) * 100)}%
                        </span>
                        <button 
                          onClick={() => {
                            download(item.url, `compressed-${item.file.name}`);
                            toast.success("Download started");
                          }}
                          className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-50 transition-colors"
                          aria-label={t('ui.download')}
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    )}
                    <button onClick={() => removeFile(index)} className="text-zinc-300 hover:text-rose-500 transition-colors" aria-label={t('ui.remove_file')}>
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
              className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 disabled:opacity-50"
            >
              {isProcessingAll ? <Loader2 size={20} className="animate-spin" /> : <Shrink size={20} />}
              {t('tool.compressor.title')}
            </button>
            <button 
              onClick={clearFiles}
              className="px-8 py-4 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:bg-zinc-950 transition-all disabled:opacity-50"
            >
              {t('ui.clear')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default withErrorBoundary(ImageCompressor);
