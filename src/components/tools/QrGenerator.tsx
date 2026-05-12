import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Share2, Copy, Palette, ShieldCheck } from 'lucide-react';
import { useTranslations, type Locale } from '../../lib/i18n';

interface Props {
  lang?: Locale;
}

export default function QrGenerator({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const [text, setText] = useState('https://lumea.app');
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrUrl, setQrUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateQr();
  }, [text, color, bgColor]);

  const generateQr = async () => {
    try {
      const url = await QRCode.toDataURL(text, {
        width: 1000,
        margin: 2,
        color: {
          dark: color,
          light: bgColor
        }
      });
      setQrUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  const download = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `lumea-qr-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Removed immediate revoke
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <label className="tool-label">{t('tool.qr-generator.title')}</label>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('ui.enter_url_text')}
              className="tool-input min-h-[120px] bg-zinc-50 border-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="tool-label">{t('ui.settings')}</label>
              <div className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-2xl">
                <input 
                  type="color" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border-none bg-transparent cursor-pointer"
                />
                <span className="font-mono text-sm font-bold">{color.toUpperCase()}</span>
              </div>
            </div>
            <div>
              <label className="tool-label">{t('ui.qr_bg_color')}</label>
              <div className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-2xl">
                <input 
                  type="color" 
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border-none bg-transparent cursor-pointer"
                />
                <span className="font-mono text-sm font-bold">{bgColor.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <button 
              onClick={download}
              className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
            >
              <Download size={20} />
              {t('ui.download')} PNG
            </button>
          </div>

          <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('ui.privacy_shield')}</span>
                </div>
                <h4 className="text-xl font-bold font-outfit">{t('ui.pro_tip')}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {t('ui.qr_pro_tip_desc')}
                </p>
             </div>
             <QrCode className="absolute -bottom-8 -right-8 w-32 h-32 text-white/5 -rotate-12" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-zinc-100 rounded-[2rem] -z-10 group-hover:bg-zinc-200/50 transition-colors"></div>
            <div className="bg-white p-6 rounded-[1.5rem] shadow-2xl shadow-zinc-200/50">
              {qrUrl ? (
                <img src={qrUrl} alt="QR Code" className="w-64 h-64 md:w-80 md:h-80" />
              ) : (
                <div className="w-80 h-80 flex items-center justify-center text-zinc-300">
                  <QrCode size={64} className="animate-pulse" />
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-center gap-4">
              <div className="px-4 py-2 bg-zinc-100 text-zinc-500 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Palette size={14} />
                {t('ui.customizable')}
              </div>
              <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} />
                {t('ui.high_res')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
