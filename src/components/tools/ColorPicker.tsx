import { withErrorBoundary } from '../ui/withErrorBoundary';
import { useState } from 'react';
import { Copy } from 'lucide-react';
import { useTranslations } from '../../lib/i18n';

interface Props {
  lang?: string;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

function hexToHsl(hex: string) {
  let { r, g, b } = hexToRgb(hex);
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function ColorPicker({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const [color, setColor] = useState('#6366f1');
  const [history, setHistory] = useState<string[]>([]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const addToHistory = (newColor: string) => {
    if (!history.includes(newColor)) {
      setHistory(prev => [newColor, ...prev].slice(0, 10));
    }
  };

  const rgb = hexToRgb(color);
  const hsl = hexToHsl(color);

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
                 aria-label={t('ui.copy')}
                >
                  <Copy size={20} />
                </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
               <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-center">
                  <span className="text-[10px] font-black uppercase text-zinc-400 block mb-1">RGB</span>
                  <span className="font-mono font-bold text-sm text-zinc-700">
                    {`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                  </span>
               </div>
               <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-center">
                  <span className="text-[10px] font-black uppercase text-zinc-400 block mb-1">HSL</span>
                   <span className="font-mono font-bold text-sm text-zinc-700">
                    {`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
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
                  aria-label={h}
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