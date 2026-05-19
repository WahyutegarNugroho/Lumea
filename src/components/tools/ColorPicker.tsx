import { withErrorBoundary } from '../ui/withErrorBoundary';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import { useTranslations } from '../../lib/i18n';

interface Props {
  lang?: string;
}

function ColorPicker({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const [color, setColor] = useState('#6366f1');
  const [isPickerActive, setIsPickerActive] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Simple notification would be nice, but we'll stick to logic for now
  };

  const addToHistory = (newColor: string) => {
    if (!history.includes(newColor)) {
      setHistory(prev => [newColor, ...prev].slice(0, 10));
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center space-y-8">
          <div 
            className="w-48 h-48 rounded-full shadow-2xl border-8 border-white group relative cursor-pointer"
            style={{ backgroundColor: color }}
          >
             <input 
                type="color" 
                value={color}
                onChange={(e) => {
                    setColor(e.target.value);
                    addToHistory(e.target.value);
                }}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
             />
          </div>
          
          <div className="w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
               <span className="font-mono font-bold text-lg text-zinc-900 uppercase">{color}</span>
               <button 
                onClick={() => copyToClipboard(color)}
                className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-500"
               >
                 <Copy size={20} />
               </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
               <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-center">
                  <span className="text-[10px] font-black uppercase text-zinc-400 block mb-1">RGB</span>
                  <span className="font-mono font-bold text-sm text-zinc-700">
                    {/* Simplified RGB extraction */}
                    {color}
                  </span>
               </div>
               <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-center">
                  <span className="text-[10px] font-black uppercase text-zinc-400 block mb-1">HSL</span>
                   <span className="font-mono font-bold text-sm text-zinc-700">
                    {color}
                  </span>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-8 text-white space-y-8">
           <div className="space-y-2">
              <h3 className="text-xl font-bold font-outfit">{t('ui.color_history')}</h3>
              <p className="text-zinc-400 text-sm">{t('ui.recent_picked_colors')}</p>
           </div>
           
           <div className="grid grid-cols-5 gap-3">
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => setColor(h)}
                  className="w-full aspect-square rounded-xl border-2 border-white/10 hover:scale-110 transition-transform shadow-lg"
                  style={{ backgroundColor: h }}
                />
              ))}
              {Array.from({ length: Math.max(0, 10 - history.length) }).map((_, i) => (
                <div key={i} className="w-full aspect-square rounded-xl bg-white/5 border border-white/5 dash" />
              ))}
           </div>

           <div className="pt-8 border-t border-white/10">
              <p className="text-sm text-zinc-400 leading-relaxed italic">
                {t('ui.color_picker_tip')}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

export default withErrorBoundary(ColorPicker);
