import { withErrorBoundary } from '../ui/withErrorBoundary';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Dropzone } from '../ui/Dropzone';
import { Download, ArrowDownCircle, ShieldCheck, Loader2, Check, FileText } from 'lucide-react';
import { useTranslations } from '../../lib/i18n';
import { useDownload } from '../../lib/hooks/useDownload';

interface Props {
  lang?: string;
}

type CompressionLevel = 'low' | 'medium' | 'high';

function PdfCompressor({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const { download } = useDownload();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium');
  const [result, setResult] = useState<{ blob: Blob; size: number } | null>(null);

  const handleFiles = (files: File[]) => {
    setFile(files[0]);
    setResult(null);
    setProgress(0);
  };

  const compressPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(20);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setProgress(50);

      // Create a new document to copy pages into (this naturally cleans up some dead data)
      const newPdfDoc = await PDFDocument.create();
      const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
      
      pages.forEach(page => newPdfDoc.addPage(page));
      setProgress(80);

      // Optimization settings
      const pdfBytes = await newPdfDoc.save({
        useObjectStreams: compressionLevel !== 'low',
        addDefaultPage: false,
      });

      const blob = new Blob([pdfBytes.buffer] as BlobPart[], { type: 'application/pdf' });
      setResult({ blob, size: blob.size });
      setProgress(100);
    } catch (error) {
      console.error(error);
      toast(t('ui.error_compress_failed'));
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!file) {
    return <Dropzone onFilesSelected={handleFiles} accept=".pdf" lang={lang} />;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,350px] gap-8">
        {/* Preview / Status Area */}
        <div className="bg-zinc-50 dark:bg-zinc-950 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-inner min-h-[400px]">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 flex flex-col items-center gap-6 max-w-sm w-full transition-all hover:scale-[1.02]">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-500">
              <FileText size={40} />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-50 truncate max-w-[200px]">{file.name}</h4>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">{formatSize(file.size)}</p>
            </div>
            
            {result && (
              <div className="w-full pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col items-center gap-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{t('ui.success')}</span>
                 <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{formatSize(result.size)}</p>
                 <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('ui.reduced_by')} {Math.round((1 - result.size / file.size) * 100)}%</p>
              </div>
            )}
          </div>

          {isProcessing && (
            <div className="absolute inset-0 bg-white dark:bg-zinc-900/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-10">
              <Loader2 size={40} className="text-zinc-900 dark:text-zinc-50 animate-spin" />
              <div className="text-center">
                <p className="font-bold text-zinc-900 dark:text-zinc-50">{t('ui.compressing')}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{progress}% {t('ui.complete')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls Area */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 font-outfit flex items-center gap-2">
                <ArrowDownCircle className="text-zinc-500 dark:text-zinc-400" size={20} />
                {t('tool.pdf-compressor.title')}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                {t('ui.pdf_compress_desc')}
              </p>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">{t('ui.comp_level')}</label>
              <div className="grid grid-cols-1 gap-2">
                {(['low', 'medium', 'high'] as CompressionLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setCompressionLevel(level)}
                    className={`py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-between ${
                      compressionLevel === level 
                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-lg' 
                        : 'border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-200 dark:hover:border-zinc-700 dark:border-zinc-800'
                    }`}
                  >
                    <span className="capitalize">{t(`ui.${level}`)}</span>
                    {compressionLevel === level && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
              {!result ? (
                <button 
                  onClick={compressPdf}
                  disabled={isProcessing}
                  className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <ArrowDownCircle size={20} />}
                  {t('ui.compress_now')}
                </button>
              ) : (
                <button 
                  onClick={() => {
                    const safeName = file.name.toLowerCase().endsWith('.pdf') ? file.name : `${file.name}.pdf`;
                    download(result.blob, `lumea-compressed-${safeName}`);
                  }}
                  className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200"
                >
                  <Download size={20} />
                  {t('ui.download')} PDF
                </button>
              )}
              <button 
                onClick={() => { setFile(null); setResult(null); }}
                className="w-full py-4 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:bg-zinc-950 transition-all"
              >
                {t('ui.change_file')}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 text-zinc-500 dark:text-zinc-400">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{t('ui.client_side')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withErrorBoundary(PdfCompressor);
