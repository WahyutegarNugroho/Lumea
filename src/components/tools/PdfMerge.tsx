import { withErrorBoundary } from '../ui/withErrorBoundary';
import { PrivacyShieldCard } from '../ui/PrivacyShieldCard';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Dropzone } from '../ui/Dropzone';
import { Download, Plus, FileText, X } from 'lucide-react';
import { useTranslations } from '../../lib/i18n';
import { useDownload } from '../../lib/hooks/useDownload';

interface Props {
  lang?: string;
}

function PdfMerge({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const { download } = useDownload();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = (newFiles: File[]) => {
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes.buffer] as BlobPart[], { type: 'application/pdf' });
      download(blob, 'lumea_merged_result.pdf');

      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
    } catch (error) {
      console.error('Merge failed:', error);
      toast(t('ui.error_merge_failed') || 'Merge failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {files.length === 0 ? (
        <Dropzone onFilesSelected={handleFiles} accept="application/pdf" multiple={true} lang={lang} />
      ) : (
        <div className="space-y-6">
          <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 mb-6 flex items-center gap-2">
              <FileText size={20} />
              {t('tool.merge.title')} ({files.length})
            </h3>
            
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={`${file.name}-${index}`} className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:border-zinc-200 dark:hover:border-zinc-700 dark:border-zinc-800 group">
                  <div className="text-zinc-300 group-hover:text-zinc-500 dark:text-zinc-400 cursor-grab">
                    
                  </div>
                  <div className="w-10 h-10 bg--50 dark:bg--900/30 text--600 dark:text--400 rounded-xl flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">{file.name}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <button 
                    onClick={() => removeFile(index)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg--50 dark:bg--900/30 hover:text--600 dark:text--400 transition-colors"
                    aria-label={t('ui.remove_file')}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'application/pdf';
                input.multiple = true;
                input.onchange = (e) => {
                  const newFiles = Array.from((e.target as HTMLInputElement).files || []);
                  handleFiles(newFiles);
                };
                input.click();
              }}
              className="w-full mt-6 py-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-500 dark:text-zinc-400 font-bold flex items-center justify-center gap-2 hover:border-zinc-400 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-800 transition-all text-sm"
            >
              <Plus size={20} />
              {t('ui.add_more_pdfs')}
            </button>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={mergePdfs}
              disabled={files.length < 2 || isProcessing}
              className="px-10 py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-zinc-200"
            >
              {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Download size={20} />}
              {isProcessing ? t('ui.merging_pdfs') : t('tool.merge.title')}
            </button>
            <button 
              onClick={() => setFiles([])}
              className="px-8 py-4 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:bg-zinc-950 transition-all text-sm"
            >
              {t('ui.clear')}
            </button>
          </div>

          <PrivacyShieldCard t={t} descKey="ui.merge_privacy_desc" decorIcon={FileText} />
        </div>
      )}
    </div>
  );
}

export default withErrorBoundary(PdfMerge);
