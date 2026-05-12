import { useState, useEffect, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Dropzone } from '../ui/Dropzone';
import { Download, Trash2, GripVertical, FileText, ShieldCheck, RotateCw, LayoutGrid } from 'lucide-react';
import { useTranslations, type Locale } from '../../lib/i18n';

interface Props {
  lang?: Locale;
}

interface PageItem {
  id: string;
  index: number;
  preview: string;
}

// Sortable Item Component
function SortablePage({ id, page, onDelete, index, t }: { id: string, page: PageItem, onDelete: (id: string) => void, index: number, t: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative group bg-white border-2 rounded-3xl p-2 transition-colors ${isDragging ? 'border-zinc-900 shadow-2xl' : 'border-zinc-100 shadow-sm hover:border-zinc-300'}`}
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100">
        <img src={page.preview} alt={`Page`} className="w-full h-full object-contain pointer-events-none" />
        
        {/* Drag Handle Overlay */}
        <div 
          {...attributes} 
          {...listeners}
          className="absolute inset-0 cursor-grab active:cursor-grabbing flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5"
        >
          <div className="bg-white/90 p-2 rounded-xl shadow-lg text-zinc-900 backdrop-blur-sm">
            <GripVertical size={20} />
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex items-center justify-between px-1">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-zinc-900">{t('ui.page_label')} {index + 1}</span>
          <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter">{t('ui.original_label')}: {page.index + 1}</span>
        </div>
        <button 
          onClick={() => onDelete(id)}
          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default function PdfOrganizer({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Initialize PDF.js worker inside useEffect for client-side safety
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleFiles = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setIsProcessing(true);
    setStatus(t('ui.generating_previews'));

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      const newPages: PageItem[] = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        // Increased scale from 0.3 to 0.8 for bigger/clearer previews
        const viewport = page.getViewport({ scale: 0.8 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context as any, viewport } as any).promise;
          newPages.push({
            id: `page-${i}-${Math.random().toString(36).substring(2, 9)}`,
            index: i - 1,
            preview: canvas.toDataURL()
          });
        }
      }
      setPages(newPages);
    } catch (error) {
      console.error(error);
      alert(t('ui.error_pdf_load'));

    } finally {
      setIsProcessing(false);
      setStatus('');
    }
  };

  const deletePage = useCallback((id: string) => {
    setPages(prev => prev.filter(p => p.id !== id));
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const savePdf = async () => {
    if (!file || pages.length === 0) return;
    setIsProcessing(true);
    setStatus(t('ui.creating_pdf'));

    try {
      const arrayBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const outDoc = await PDFDocument.create();

      for (const pageItem of pages) {
        const [copiedPage] = await outDoc.copyPages(srcDoc, [pageItem.index]);
        outDoc.addPage(copiedPage);
      }

      const pdfBytes = await outDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `organized-${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert(t('ui.error_pdf_save'));

    } finally {
      setIsProcessing(false);
      setStatus('');
    }
  };

  if (!file) {
    return <Dropzone onFilesSelected={handleFiles} accept="application/pdf" lang={lang} />;
  }

  const activePage = pages.find(p => p.id === activeId);

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] border border-zinc-200 shadow-sm sticky top-4 z-40">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-200">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 truncate max-w-[150px] md:max-w-[300px]">{file.name}</h3>
            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{pages.length} {t('ui.pages')}</p>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => { setFile(null); setPages([]); }}
            className="flex-1 md:flex-none px-6 py-3 bg-zinc-100 text-zinc-600 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all"
            disabled={isProcessing}
          >
            {t('ui.cancel')}
          </button>
          <button 
            onClick={savePdf}
            className="flex-1 md:flex-none px-8 py-3 bg-zinc-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-300"
            disabled={isProcessing || pages.length === 0}
          >
            {isProcessing ? <RotateCw size={18} className="animate-spin" /> : <Download size={18} />}
            {t('ui.save_organized_pdf')}
          </button>
        </div>
      </div>

      {isProcessing && !pages.length ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-16 h-16 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin"></div>
          <p className="text-zinc-500 font-bold text-sm animate-pulse">{status}</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Grid Area with dnd-kit */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
          >
            <SortableContext items={pages.map(p => p.id)} strategy={rectSortingStrategy}>
              {/* Adjusted columns to make items bigger */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                {pages.map((page, index) => (
                  <SortablePage 
                    key={page.id} 
                    id={page.id} 
                    page={page} 
                    onDelete={deletePage} 
                    index={index} 
                    t={t}
                  />
                ))}
              </div>
            </SortableContext>

            {/* Drag Overlay for Premium Feel */}
            <DragOverlay dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: '0.4',
                  },
                },
              }),
            }}>
              {activeId ? (
                <div className="bg-white border-2 border-zinc-900 rounded-3xl p-2 shadow-2xl scale-105 opacity-90 cursor-grabbing">
                   <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100">
                    <img src={activePage?.preview} alt="Dragging" className="w-full h-full object-contain" />
                  </div>
                  <div className="mt-3 flex items-center justify-between px-1">
                    <span className="text-[10px] font-black text-zinc-900 uppercase">{t('ui.moving_label')}</span>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          {/* Info Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zinc-100">
            <div className="bg-zinc-50 border border-zinc-200 rounded-[2.5rem] p-8 flex gap-6 items-start">
              <div className="w-14 h-14 bg-zinc-900 text-white rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-lg shadow-zinc-200">
                <LayoutGrid size={28} />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-zinc-900 text-lg">{t('ui.2d_reorder_title')}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {t('ui.2d_reorder_desc')}
                </p>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-8 flex gap-6 items-start">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-[1.25rem] flex items-center justify-center shrink-0">
                <ShieldCheck size={28} />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-emerald-900 text-lg">{t('ui.absolute_privacy_title')}</h4>
                <p className="text-emerald-700/70 text-sm leading-relaxed">
                  {t('ui.absolute_privacy_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
