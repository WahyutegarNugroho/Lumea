import { useState, useRef } from 'react';
// @ts-ignore
import ImageTracer from 'imagetracerjs';
import { Dropzone } from '../ui/Dropzone';
import { Download, Zap, ImageIcon, Palette, Settings2 } from 'lucide-react';
import { useTranslations, type Locale } from '../../lib/i18n';

interface Props {
  lang?: Locale;
}

const PRESETS = [
  { id: 'default', name: 'ui.vector_preset_default', colors: 16, blur: 0 },
  { id: 'logo', name: 'ui.vector_preset_logo', colors: 4, blur: 0, lt_desc: 'ui.vector_logo_desc' },
  { id: 'photo', name: 'ui.vector_preset_photo', colors: 64, blur: 1, lt_desc: 'ui.vector_photo_desc' },
  { id: 'bw', name: 'ui.vector_preset_bw', colors: 2, blur: 0, lt_desc: 'ui.vector_bw_desc' },
];

export default function Vectorizer({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState(PRESETS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultSvg, setResultSvg] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    setFile(files[0]);
    setResultSvg(null);
  };

  const vectorize = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const url = URL.createObjectURL(file);
      
      ImageTracer.imageToSVG(url, (svgString: string) => {
        setResultSvg(svgString);
        setIsProcessing(false);
      }, {
        numberofcolors: preset.colors,
        blurradius: preset.blur,
        pal: preset.id === 'bw' ? [{r:0,g:0,b:0,a:255}, {r:255,g:255,b:255,a:255}] : undefined
      });
    } catch (error) {
      console.error(error);
      alert(t('ui.error_vector_failed'));
      setIsProcessing(false);
    }
  };

  const downloadSvg = () => {
    if (!resultSvg || !file) return;
    const blob = new Blob([resultSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lumea-vector-${file.name.split('.')[0]}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Removed immediate revoke
  };

  if (!file) {
    return <Dropzone onFilesSelected={handleFiles} accept="image/*" lang={lang} />;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-50 border border-zinc-200 rounded-3xl p-8 flex items-center justify-center min-h-[400px] relative overflow-hidden">
          {!resultSvg ? (
            <img src={URL.createObjectURL(file)} className="max-h-[500px] w-auto shadow-lg rounded-lg" alt="Original" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: resultSvg }} />
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Palette size={18} />
              {t('ui.settings')}
            </h3>
            
            <div className="space-y-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p)}
                  className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                    preset.id === p.id 
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-lg' 
                      : 'border-transparent bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  <div className="font-bold text-sm">{t(p.name as any)}</div>
                  <div className={`text-[10px] mt-1 ${preset.id === p.id ? 'text-zinc-400' : 'text-zinc-400'}`}>
                    {p.colors} {t('ui.colors')} • {p.blur > 0 ? t('ui.smooth') : t('ui.sharp')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button 
              onClick={vectorize}
              disabled={isProcessing}
              className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
            >
              {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Zap size={20} />}
              {t('tool.vectorizer.title')}
            </button>
            
            {resultSvg && (
              <button 
                onClick={downloadSvg}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
              >
                <Download size={20} />
                {t('ui.download')} SVG
              </button>
            )}

            <button 
              onClick={() => { setFile(null); setResultSvg(null); }}
              className="w-full py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-bold hover:bg-zinc-50 transition-all"
            >
              {t('ui.clear')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
