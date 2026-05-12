import { useState, useEffect, useRef } from 'react';
// @ts-ignore
import bwipjs from 'bwip-js';
import { Download, Barcode, ShieldCheck, Zap, Info, ArrowRight, Settings2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslations, type Locale } from '../../lib/i18n';

interface Props {
  lang?: Locale;
}

const BARCODE_TYPES = [
  { id: 'code128', name: 'Code 128 (General)', desc: 'Supports all ASCII characters' },
  { id: 'ean13', name: 'EAN-13 (Retail)', desc: 'Requires exactly 13 digits' },
  { id: 'ean8', name: 'EAN-8 (Retail)', desc: 'Requires exactly 8 digits' },
  { id: 'upca', name: 'UPC-A (USA Retail)', desc: 'Requires exactly 12 digits' },
  { id: 'code39', name: 'Code 39 (Industrial)', desc: 'Uppercase letters, numbers, and some symbols' },
  { id: 'itf14', name: 'ITF-14 (Shipping)', desc: 'Requires 14 digits' },
];

export default function BarcodeGenerator({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const [content, setContent] = useState('1234567890');
  const [type, setType] = useState('code128');
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTimeout = useRef<any>(null);

  useEffect(() => {
    if (renderTimeout.current) clearTimeout(renderTimeout.current);
    
    renderTimeout.current = setTimeout(() => {
      generateBarcode();
    }, 50);

    return () => {
      if (renderTimeout.current) clearTimeout(renderTimeout.current);
    };
  }, [content, type]);

  const generateBarcode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Clear canvas before each attempt
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!content.trim()) {
      setError('Content cannot be empty');
      return;
    }

    try {
      bwipjs.toCanvas(canvas, {
        bcid: type,       
        text: content,    
        scale: 4,         
        height: 12,       
        includetext: true, 
        textxalign: 'center',
        paddingwidth: 15,
        paddingheight: 15,
        backgroundcolor: 'ffffff'
      });
      setError(null);
    } catch (e: any) {
      const msg = e.message || 'Invalid data for this barcode type';
      setError(msg.split(':').pop()?.trim() || msg);
    }
  };

  const downloadBarcode = () => {
    if (!canvasRef.current || error) return;
    const url = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `barcode-${type}-${content}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedTypeInfo = BARCODE_TYPES.find(t => t.id === type);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Input Area */}
        <div className="space-y-6 flex flex-col justify-center">
          <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-5">
               <div className="w-14 h-14 bg-zinc-900 text-white rounded-[1.2rem] flex items-center justify-center shadow-xl shadow-zinc-200">
                  <Barcode size={28} />
               </div>
               <div>
                  <h4 className="font-bold text-zinc-900 text-xl tracking-tight">Barcode Engine</h4>
                  <p className="text-xs text-zinc-400 font-black uppercase tracking-widest mt-1">Smart Validation Active</p>
               </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Settings2 size={14} className="text-zinc-400" />
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('ui.barcode_type')}</label>
                </div>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 font-bold text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 transition-all cursor-pointer"
                >
                  {BARCODE_TYPES.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-zinc-400 italic px-1 flex items-center gap-2">
                  <Info size={12} /> {selectedTypeInfo?.desc}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-zinc-400" />
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('ui.barcode_content')}</label>
                </div>
                <input 
                  type="text" 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter barcode data..."
                  className={`w-full bg-zinc-50 border rounded-2xl px-5 py-4 font-bold text-zinc-900 outline-none transition-all ${
                    error ? 'border-rose-500 focus:ring-rose-500 ring-1 ring-rose-500/20' : 'border-zinc-200 focus:ring-zinc-900'
                  }`}
                />
                
                {error ? (
                  <div className="flex items-center gap-2 text-rose-500 bg-rose-500/5 p-3 rounded-xl border border-rose-500/20 animate-in slide-in-from-top-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <p className="text-[11px] font-bold tracking-tight">{error}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <p className="text-[11px] font-bold tracking-tight">Format looks correct</p>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={downloadBarcode}
              disabled={!!error}
              className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-2xl ${
                error 
                ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed shadow-none' 
                : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-zinc-200 hover:scale-[1.02] active:scale-95'
              }`}
            >
              <Download size={22} className={error ? 'text-zinc-200' : 'text-blue-400'} />
              {t('ui.download')} PNG
            </button>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-3xl p-6 flex gap-5 items-start">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-emerald-900 text-sm">{t('ui.on_device_generation')}</h4>
              <p className="text-emerald-700/70 text-xs leading-relaxed">
                {t('ui.barcode_privacy_desc')}
              </p>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="space-y-6">
          <div className="bg-zinc-950 rounded-[2rem] border border-zinc-800 shadow-2xl overflow-hidden min-h-[500px] flex flex-col group relative">
             <div className="flex items-center justify-between p-8 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl rounded-t-[2rem]">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
                      <Barcode size={20} className="text-zinc-500" />
                   </div>
                   <h4 className="text-white font-bold font-outfit text-lg">{t('ui.realtime_preview')}</h4>
                </div>
             </div>

             <div className="flex-1 p-12 flex flex-col items-center justify-center relative overflow-hidden bg-zinc-900/30">
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-zinc-950 to-transparent pointer-events-none z-10 rounded-tr-[2rem]"></div>
                
                <div className={`bg-white p-12 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] transform transition-all duration-700 relative z-10 border border-white/10 ${
                  error ? 'opacity-20 scale-95 grayscale blur-[2px]' : 'group-hover:scale-105'
                }`}>
                   <canvas ref={canvasRef} className="max-w-full h-auto"></canvas>
                </div>
                
                {error && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-4 p-12 text-center animate-in fade-in duration-500">
                     <div className="w-20 h-20 bg-rose-500/20 text-rose-500 rounded-[2.5rem] flex items-center justify-center border border-rose-500/20 shadow-2xl">
                        <AlertCircle size={40} />
                     </div>
                     <div className="space-y-1">
                        <p className="text-white font-bold text-lg">Invalid Input</p>
                        <p className="text-zinc-500 text-xs max-w-[200px]">Fix the errors in settings to update the preview.</p>
                     </div>
                  </div>
                )}

                {!error && (
                  <div className="mt-12 text-center relative z-10">
                    <div className="px-4 py-2 bg-zinc-900/50 backdrop-blur-md rounded-full border border-zinc-800 flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Live Engine Active</p>
                    </div>
                  </div>
                )}

                <Barcode className="absolute -bottom-10 -left-10 w-64 h-64 text-white/5 -rotate-12 group-hover:rotate-0 transition-all duration-1000 pointer-events-none" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
