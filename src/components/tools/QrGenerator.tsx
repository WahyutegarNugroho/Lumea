import { withErrorBoundary } from '../ui/withErrorBoundary';
import { PrivacyShieldCard } from '../ui/PrivacyShieldCard';
import { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Palette, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslations } from '../../lib/i18n';
import { useDownload } from '../../lib/hooks/useDownload';

interface Props {
  lang?: string;
}

function QrGenerator({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const { download } = useDownload();
  const [text, setText] = useState('https://lumea.app');
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrUrl, setQrUrl] = useState('');

  const generateQr = useCallback(async (): Promise<string | null> => {
    try {
      return await QRCode.toDataURL(text, {
        width: 1000,
        margin: 2,
        color: {
          dark: color,
          light: bgColor
        }
      });
    } catch (err) {
      console.error(err);
      toast(t('ui.error_conversion_failed'));
      return null;
    }
  }, [text, color, bgColor, t]);

  useEffect(() => {
    let cancelled = false;
    generateQr().then((url) => {
      if (!cancelled && url) setQrUrl(url);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [text, color, bgColor, generateQr]);

  const handleDownload = () => {
    if (!qrUrl) return;
    download(qrUrl, `qr-${Date.now()}.png`);
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
              className="tool-input min-h-[120px] bg-zinc-50 dark:bg-zinc-950 border-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="qr-color" className="tool-label">{t('ui.settings')}</label>
              <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <input 
                  id="qr-color"
                  type="color" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border-none bg-transparent cursor-pointer"
                />
                <span className="font-mono text-sm font-bold">{color.toUpperCase()}</span>
              </div>
            </div>
            <div>
              <label htmlFor="qr-bg-color" className="tool-label">{t('ui.qr_bg_color')}</label>
              <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <input 
                  id="qr-bg-color"
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
              onClick={handleDownload}
              className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
            >
              <Download size={20} />
              {t('ui.download')} PNG
            </button>
          </div>

          <PrivacyShieldCard t={t} descKey="ui.qr_pro_tip_desc" decorIcon={QrCode} />
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-zinc-100 dark:bg-zinc-800 rounded-[2rem] -z-10 group-hover:bg-zinc-200/50 transition-colors"></div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-[1.5rem] shadow-2xl shadow-zinc-200/50">
              {qrUrl ? (
                <img src={qrUrl} alt="QR Code" className="w-64 h-64 md:w-80 md:h-80" />
              ) : (
                <div className="w-80 h-80 flex items-center justify-center text-zinc-300">
                  <QrCode size={64} className="animate-pulse" />
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-center gap-4">
              <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Palette size={14} />
                {t('ui.customizable')}
              </div>
              <div className="px-4 py-2 bg--50 dark:bg--900/30 text--600 dark:text--400 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
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

export default withErrorBoundary(QrGenerator);
