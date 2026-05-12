import { useState, useRef, useEffect, useCallback } from 'react';
import { Palette, Copy, Check, Pipette, RotateCcw, Info } from 'lucide-react';
import { useTranslations, type Locale } from '../../lib/i18n';

interface Props {
  lang?: Locale;
}

export default function ColorPicker({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const [h, setH] = useState(294); 
  const [s, setS] = useState(56);  
  const [b, setB] = useState(30);  
  const [copied, setCopied] = useState<string | null>(null);
  const [currentOrder, setCurrentColor] = useState('#6366f1');

  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const [isDraggingSV, setIsDraggingSV] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);

  // Conversion logic
  const getRgb = useCallback((h: number, s: number, b: number) => {
    const v = b / 100;
    const s_norm = s / 100;
    const l = v * (1 - s_norm / 2);
    const s_l = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
    const h_norm = h / 360;
    let r, g, bl;
    if (s_l === 0) {
      r = g = bl = l;
    } else {
      const q = l < 0.5 ? l * (1 + s_l) : l + s_l - l * s_l;
      const p = 2 * l - q;
      const hue2rgb = (t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      r = hue2rgb(h_norm + 1/3);
      g = hue2rgb(h_norm);
      bl = hue2rgb(h_norm - 1/3);
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(bl * 255)
    };
  }, []);

  const getCmyk = useCallback((r: number, g: number, b: number) => {
    let r_norm = r / 255;
    let g_norm = g / 255;
    let b_norm = b / 255;
    let k = 1 - Math.max(r_norm, g_norm, b_norm);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    let c = Math.round(((1 - r_norm - k) / (1 - k)) * 100);
    let m = Math.round(((1 - g_norm - k) / (1 - k)) * 100);
    let y = Math.round(((1 - b_norm - k) / (1 - k)) * 100);
    return { c, m, y, k: Math.round(k * 100) };
  }, []);

  const rgb = getRgb(h, s, b);
  const cmyk = getCmyk(rgb.r, rgb.g, rgb.b);
  const hex = `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;

  const handleCopy = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSVMouse = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!svRef.current) return;
    const rect = svRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setS(Math.round(x * 100));
    setB(Math.round((1 - y) * 100));
  }, []);

  const handleHueMouse = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setH(Math.round(y * 360));
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingSV) handleSVMouse(e);
      if (isDraggingHue) handleHueMouse(e);
    };
    const onMouseUp = () => {
      setIsDraggingSV(false);
      setIsDraggingHue(false);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDraggingSV, isDraggingHue, handleSVMouse, handleHueMouse]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="bg-[#0b0b0c] p-6 lg:p-8 rounded-[2rem] border border-zinc-800 shadow-2xl space-y-6">
        
        {/* PICKER SECTION */}
        <div className="flex gap-5 h-[300px] lg:h-[400px]">
          <div 
            ref={svRef}
            className="flex-1 h-full rounded-xl relative cursor-crosshair overflow-hidden border border-white/5"
            style={{ backgroundColor: `hsl(${h}, 100%, 50%)` }}
            onMouseDown={(e) => { setIsDraggingSV(true); handleSVMouse(e); }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div 
              className="absolute w-6 h-6 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-xl pointer-events-none"
              style={{ left: `${s}%`, top: `${100 - b}%` }}
            ></div>
          </div>

          <div 
            ref={hueRef}
            className="w-10 h-full rounded-xl relative cursor-ns-resize border border-white/5 shadow-lg"
            style={{ 
              background: 'linear-gradient(to bottom, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)' 
            }}
            onMouseDown={(e) => { setIsDraggingHue(true); handleHueMouse(e); }}
          >
            <div 
              className="absolute left-0 right-0 h-4 bg-white border-2 border-zinc-950 rounded-sm shadow-md -translate-y-1/2"
              style={{ top: `${(h / 360) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* CONTROLS PANEL */}
        <div className="bg-[#121214] p-6 rounded-2xl border border-zinc-800 space-y-8">
          {/* Comparison */}
          <div className="grid grid-cols-2 h-16 rounded-xl overflow-hidden border border-zinc-800">
            <div className="flex flex-col">
              <div className="h-1/3 bg-zinc-950 flex items-center justify-center border-b border-zinc-800">
                <span className="text-[9px] font-bold uppercase text-zinc-500 tracking-[0.3em]">{t('ui.new_color')}</span>
              </div>
              <div className="flex-1" style={{ backgroundColor: hex }}></div>
            </div>
            <div className="flex flex-col border-l border-zinc-800">
              <div className="h-1/3 bg-zinc-950 flex items-center justify-center border-b border-zinc-800">
                <span className="text-[9px] font-bold uppercase text-zinc-500 tracking-[0.3em]">{t('ui.current_color')}</span>
              </div>
              <div className="flex-1" style={{ backgroundColor: currentOrder }}></div>
            </div>
          </div>

          {/* Color Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* HSB */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center border-b border-zinc-800 pb-2">HSB</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-center">
                  <span className="text-[9px] text-zinc-600 block">H</span>
                  <span className="text-white font-mono text-sm">{h}°</span>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-center">
                  <span className="text-[9px] text-zinc-600 block">S</span>
                  <span className="text-white font-mono text-sm">{s}%</span>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-center">
                  <span className="text-[9px] text-zinc-600 block">B</span>
                  <span className="text-white font-mono text-sm">{b}%</span>
                </div>
              </div>
            </div>

            {/* RGB */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center border-b border-zinc-800 pb-2">RGB</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-center">
                  <span className="text-[9px] text-zinc-600 block">R</span>
                  <span className="text-white font-mono text-sm">{rgb.r}</span>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-center">
                  <span className="text-[9px] text-zinc-600 block">G</span>
                  <span className="text-white font-mono text-sm">{rgb.g}</span>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-center">
                  <span className="text-[9px] text-zinc-600 block">B</span>
                  <span className="text-white font-mono text-sm">{rgb.b}</span>
                </div>
              </div>
            </div>

            {/* CMYK */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center border-b border-zinc-800 pb-2">CMYK</h4>
              <div className="grid grid-cols-4 gap-1.5">
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-center">
                  <span className="text-[9px] text-zinc-600 block">C</span>
                  <span className="text-white font-mono text-[10px]">{cmyk.c}%</span>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-center">
                  <span className="text-[9px] text-zinc-600 block">M</span>
                  <span className="text-white font-mono text-[10px]">{cmyk.m}%</span>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-center">
                  <span className="text-[9px] text-zinc-600 block">Y</span>
                  <span className="text-white font-mono text-[10px]">{cmyk.y}%</span>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-center">
                  <span className="text-[9px] text-zinc-600 block">K</span>
                  <span className="text-white font-mono text-[10px]">{cmyk.k}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* HEX and Actions */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <div className="bg-black border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <span className="text-zinc-700 font-bold text-xl">#</span>
                 <span className="text-white font-mono text-2xl font-bold tracking-[0.4em] uppercase">{hex.replace('#', '')}</span>
              </div>
              <button 
                onClick={() => handleCopy(hex.toUpperCase(), 'hex')}
                className="p-3 hover:bg-zinc-800 rounded-xl transition-all text-zinc-500 hover:text-white"
              >
                {copied === 'hex' ? <Check size={24} className="text-emerald-500" /> : <Copy size={24} />}
              </button>
            </div>

            <button 
              onClick={() => setCurrentColor(hex)}
              className="w-full py-5 bg-white text-black rounded-xl font-black hover:bg-zinc-200 transition-all text-xs uppercase tracking-[0.3em] shadow-xl active:scale-95"
            >
              {t('ui.set_as_current')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
