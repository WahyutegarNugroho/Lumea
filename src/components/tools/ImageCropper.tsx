import { useState, useRef, useEffect, useCallback } from 'react';
import { Dropzone } from '../ui/Dropzone';
import { Download, Crop as CropIcon, RefreshCw, Maximize, RotateCcw, Check } from 'lucide-react';
import { useTranslations, type Locale } from '../../lib/i18n';

interface Props {
  lang?: Locale;
}

type AspectRatio = 'free' | '1:1' | '4:3' | '16:9';

export default function ImageCropper({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('free');
  const [crop, setCrop] = useState({ x: 10, y: 10, width: 80, height: 80 }); // Percentage based
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragType, setDragType] = useState<'move' | 'nw' | 'ne' | 'sw' | 'se' | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = (files: File[]) => {
    const f = files[0];
    setFile(f);
    const img = new Image();
    img.src = URL.createObjectURL(f);
    img.onload = () => {
      setImage(img);
      // Initialize crop to a nice default
      setCrop({ x: 10, y: 10, width: 80, height: 80 });
    };
  };

  const getCanvasCoordinates = (e: React.MouseEvent | MouseEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    };
  };

  const startDragging = (type: 'move' | 'nw' | 'ne' | 'sw' | 'se', e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragType(type);
    const coords = getCanvasCoordinates(e);
    setDragStart({ x: coords.x - crop.x, y: coords.y - crop.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragType) return;

    const coords = {
        x: 0,
        y: 0,
    };
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        coords.x = ((e.clientX - rect.left) / rect.width) * 100;
        coords.y = ((e.clientY - rect.top) / rect.height) * 100;
    }

    setCrop(prev => {
      let { x, y, width, height } = { ...prev };

      if (dragType === 'move') {
        x = coords.x - dragStart.x;
        y = coords.y - dragStart.y;
      } else if (dragType === 'se') {
        width = Math.max(5, coords.x - x);
        height = Math.max(5, coords.y - y);
      } else if (dragType === 'nw') {
        const dx = x - coords.x;
        const dy = y - coords.y;
        x = coords.x;
        y = coords.y;
        width += dx;
        height += dy;
      } else if (dragType === 'ne') {
        const dy = y - coords.y;
        y = coords.y;
        width = Math.max(5, coords.x - x);
        height += dy;
      } else if (dragType === 'sw') {
        const dx = x - coords.x;
        x = coords.x;
        width += dx;
        height = Math.max(5, coords.y - y);
      }

      // Maintain Aspect Ratio if not free
      if (aspectRatio !== 'free' && dragType !== 'move') {
        const ratio = aspectRatio === '1:1' ? 1 : aspectRatio === '4:3' ? 4/3 : 16/9;
        const containerRatio = containerRef.current ? containerRef.current.offsetWidth / containerRef.current.offsetHeight : 1;
        // In percentage space, width = height * ratio * (H_px / W_px)
        const adjustedRatio = ratio / containerRatio;
        
        if (dragType === 'se' || dragType === 'sw' || dragType === 'ne' || dragType === 'nw') {
           height = width / adjustedRatio;
        }
      }

      // Constrain to container
      x = Math.max(0, Math.min(x, 100 - width));
      y = Math.max(0, Math.min(y, 100 - height));
      width = Math.min(width, 100 - x);
      height = Math.min(height, 100 - y);

      return { x, y, width, height };
    });
  }, [isDragging, dragType, dragStart, aspectRatio]);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
    setDragType(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', stopDragging);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDragging);
    };
  }, [isDragging, handleMouseMove, stopDragging]);

  const handleDownload = () => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    
    const cropX = (crop.x / 100) * image.width;
    const cropY = (crop.y / 100) * image.height;
    const cropW = (crop.width / 100) * image.width;
    const cropH = (crop.height / 100) * image.height;

    canvas.width = cropW;
    canvas.height = cropH;
    ctx.drawImage(image, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    
    const link = document.createElement('a');
    link.download = `lumea-cropped-${file?.name || 'image'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!file) {
    return <Dropzone onFilesSelected={handleFiles} accept="image/*" lang={lang} />;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,350px] gap-8">
        {/* Editor Area */}
        <div className="bg-zinc-950 rounded-[2.5rem] p-4 flex items-center justify-center relative overflow-hidden border border-zinc-800 shadow-2xl min-h-[600px]">
          {image && (
            <div 
              ref={containerRef}
              className="relative inline-block select-none cursor-crosshair"
              style={{ maxHeight: '100%', maxWidth: '100%' }}
            >
              <img 
                src={image.src} 
                className="max-h-[550px] w-auto pointer-events-none opacity-40" 
                alt="Original" 
              />
              
              {/* Overlay / Dimmed background */}
              <div className="absolute inset-0 bg-black/40"></div>

              {/* Crop Box */}
              <div 
                className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] cursor-move transition-shadow"
                style={{
                  left: `${crop.x}%`,
                  top: `${crop.y}%`,
                  width: `${crop.width}%`,
                  height: `${crop.height}%`,
                }}
                onMouseDown={(e) => startDragging('move', e)}
              >
                {/* Visual Image inside crop box (High opacity) */}
                <div 
                   className="absolute inset-0 overflow-hidden pointer-events-none"
                >
                   <img 
                    src={image.src} 
                    className="absolute max-w-none" 
                    style={{
                        width: `${10000 / crop.width}%`,
                        height: `${10000 / crop.height}%`,
                        left: `${-crop.x * (100 / crop.width)}%`,
                        top: `${-crop.y * (100 / crop.height)}%`,
                    }}
                    alt="Crop View" 
                   />
                </div>

                {/* Resizing Handles */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-white rounded-full cursor-nw-resize" onMouseDown={(e) => { e.stopPropagation(); startDragging('nw', e); }}></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full cursor-ne-resize" onMouseDown={(e) => { e.stopPropagation(); startDragging('ne', e); }}></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white rounded-full cursor-sw-resize" onMouseDown={(e) => { e.stopPropagation(); startDragging('sw', e); }}></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white rounded-full cursor-se-resize" onMouseDown={(e) => { e.stopPropagation(); startDragging('se', e); }}></div>
                
                {/* Rule of thirds grid */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                  <div className="border-r border-white/20 border-b border-white/20"></div>
                  <div className="border-r border-white/20 border-b border-white/20"></div>
                  <div className="border-b border-white/20"></div>
                  <div className="border-r border-white/20 border-b border-white/20"></div>
                  <div className="border-r border-white/20 border-b border-white/20"></div>
                  <div className="border-b border-white/20"></div>
                  <div className="border-r border-white/20"></div>
                  <div className="border-r border-white/20"></div>
                  <div></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls Area */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-zinc-900 font-outfit flex items-center gap-2">
                <CropIcon className="text-zinc-400" size={20} />
                {t('tool.cropper.title')}
              </h3>
              <p className="text-zinc-500 text-sm">
                {t('ui.cropper_desc')}
              </p>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400">{t('ui.aspect_ratio')}</label>
              <div className="grid grid-cols-2 gap-2">
                {(['free', '1:1', '4:3', '16:9'] as AspectRatio[]).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all ${
                      aspectRatio === ratio 
                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-lg' 
                        : 'border-zinc-100 text-zinc-500 hover:border-zinc-200'
                    }`}
                  >
                    {ratio === 'free' ? <><Maximize size={14} className="inline mr-2" />{t('ui.free')}</> : ratio.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 space-y-3">
              <button 
                onClick={handleDownload}
                className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
              >
                <Check size={20} />
                {t('ui.apply_download')}
              </button>
              <button 
                onClick={() => setFile(null)}
                className="w-full py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-bold hover:bg-zinc-50 transition-all"
              >
                <RotateCcw size={18} className="inline mr-2" />
                {t('ui.change_file')}
              </button>
            </div>
          </div>

          <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
             <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg border border-zinc-200">
                   <RefreshCw size={16} className="text-zinc-400" />
                </div>
                <div>
                   <h4 className="text-sm font-bold text-zinc-900">{t('ui.pro_tip')}</h4>
                   <p className="text-xs text-zinc-500 mt-1">{t('ui.cropper_tip')}</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
