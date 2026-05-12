import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Dropzone } from '../ui/Dropzone';
import { Download, FileImage, FileText, X, GripVertical, Plus } from 'lucide-react';
import { useTranslations, type Locale } from '../../lib/i18n';

interface Props {
  lang?: Locale;
}

export default function JpgToPdf({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const [images, setImages] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = (newFiles: File[]) => {
    setImages([...images, ...newFiles]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const imageFile of images) {
        const imageBytes = await imageFile.arrayBuffer();
        let image;
        
        if (imageFile.type === 'image/jpeg' || imageFile.type === 'image/jpg') {
          image = await pdfDoc.embedJpg(imageBytes);
        } else if (imageFile.type === 'image/png') {
          image = await pdfDoc.embedPng(imageBytes);
        } else {
          continue; // Skip unsupported
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lumea-images-to-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Removed immediate revoke
    } catch (error) {
      console.error(error);
      alert(t('ui.error_jpg_to_pdf_failed'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {images.length === 0 ? (
        <Dropzone onFilesSelected={handleFiles} accept="image/jpeg,image/png" multiple={true} lang={lang} />
      ) : (
        <div className="space-y-6">
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6">
            <h3 className="font-bold text-zinc-900 mb-6 flex items-center gap-2 uppercase tracking-wider text-sm">
              <FileImage size={18} />
              {t('ui.images_to_convert')} ({images.length})
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((file, index) => (
                <div key={`${file.name}-${index}`} className="relative aspect-square bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden group hover:border-zinc-300 transition-all">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt="Preview" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                  <button 
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 text-zinc-500 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                  >
                    <X size={14} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/90 backdrop-blur-sm border-t border-zinc-100">
                    <p className="text-[10px] font-bold text-zinc-900 truncate">{file.name}</p>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/jpeg,image/png';
                  input.multiple = true;
                  input.onchange = (e) => {
                    const newFiles = Array.from((e.target as HTMLInputElement).files || []);
                    handleFiles(newFiles);
                  };
                  input.click();
                }}
                className="aspect-square border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:border-zinc-300 transition-all gap-2"
              >
                <Plus size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{t('ui.add_more')}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={convertToPdf}
              disabled={isProcessing || images.length === 0}
              className="px-10 py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
            >
              {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <FileText size={20} />}
              {t('ui.convert_to_pdf')}
            </button>
            <button 
              onClick={() => setImages([])}
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
