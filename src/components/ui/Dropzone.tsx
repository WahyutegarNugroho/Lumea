import React, { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';
import { useTranslations, type Locale } from '../../lib/i18n';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  lang?: Locale;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFilesSelected, accept = "image/*", multiple = false, lang = 'en' }) => {
  const t = useTranslations(lang);
  
  // Fallback texts
  const dropText = t('ui.drop_files') || 'Click or drag files to upload';
  const privacyNote = t('ui.privacy_note') || 'Your files are processed locally and never uploaded.';

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(multiple ? files : [files[0]]);
    }
  }, [onFilesSelected, multiple]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onFilesSelected(multiple ? files : [files[0]]);
    }
  };

  // Determine which badges to show based on accept prop
  const getBadges = () => {
    const acc = accept || "";
    if (acc.includes('pdf')) return ['PDF'];
    if (acc.includes('image') || acc.includes('png') || acc.includes('jpg')) return ['JPG', 'PNG', 'WebP', 'SVG'];
    if (acc.includes('word') || acc.includes('officedocument')) return ['DOCX', 'DOC'];
    if (acc.includes('excel') || acc.includes('spreadsheet')) return ['XLSX', 'XLS'];
    return ['Files'];
  };

  return (
    <div 
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="group relative w-full min-h-[400px] border-2 border-dashed border-zinc-200 rounded-[3rem] flex flex-col items-center justify-center p-12 transition-all hover:border-zinc-900 hover:bg-zinc-50/50 cursor-pointer overflow-hidden bg-white shadow-xl shadow-zinc-100/50"
    >
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none"></div>
      
      <input 
        type="file" 
        onChange={onFileChange} 
        accept={accept} 
        multiple={multiple}
        className="absolute inset-0 opacity-0 cursor-pointer z-20"
      />
      
      <div className="w-20 h-20 bg-zinc-50 text-zinc-400 rounded-3xl flex items-center justify-center mb-8 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-zinc-900 group-hover:text-white group-hover:rotate-6 border border-zinc-100 relative z-10">
        <Upload size={36} strokeWidth={2.5} />
      </div>

      <h3 className="text-2xl font-bold text-zinc-900 mb-3 font-outfit relative z-10 tracking-tight text-center">{dropText}</h3>
      <p className="text-zinc-500 text-sm text-center max-w-sm font-medium relative z-10 leading-relaxed">
        {privacyNote}
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-3 relative z-10">
        {getBadges().map(badge => (
          <span key={badge} className="px-5 py-2 bg-zinc-900/5 text-zinc-500 border border-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all duration-300">
            {badge}
          </span>
        ))}
      </div>

      <div className="absolute bottom-6 flex items-center gap-2 text-zinc-300 z-10">
        <FileText size={14} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Safe & Secure Engine</span>
      </div>
    </div>
  );
};
