import { useState, useRef, useEffect } from 'react';
import pkg from '@mediapipe/selfie_segmentation';
const { SelfieSegmentation } = pkg;
import { Dropzone } from '../ui/Dropzone';
import { Download, Eraser, ImageIcon, Loader2, Zap, ShieldCheck } from 'lucide-react';
import { useTranslations, type Locale } from '../../lib/i18n';

interface Props {
  lang?: Locale;
}

export default function BackgroundRemover({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [smoothness, setSmoothness] = useState(1.0);
  const [sensitivity, setSensitivity] = useState(1.0);
  const [expansion, setExpansion] = useState(-0.25); // Aggressive shrink for Zero-Halo result
  const [modelType, setModelType] = useState<0 | 1>(1);
  const [hdMode, setHdMode] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFiles = (files: File[]) => {
    setFile(files[0]);
    setResultUrl(null);
    setProgress(0);
  };

  const removeBackground = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(10);

    try {
      const segmentation = new SelfieSegmentation({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
      });

      segmentation.setOptions({
        modelSelection: modelType,
      });

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
      await img.decode();
      setProgress(40);

      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      canvas.width = img.width;
      canvas.height = img.height;

      segmentation.onResults((results) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        
        const maskRes = 256;
        const scaleFactor = canvas.width / maskRes;
        
        ctx.globalCompositeOperation = 'copy';
        
        if (hdMode) {
          // Refined Pro Pipeline: Balanced Smoothing + High Contrast
          // A blur proportional to the scale factor hides the AI grid perfectly.
          const smoothBlur = (smoothness * scaleFactor) / 2.5;
          // Expansion/Contraction with a wider, more accurate range.
          const brightnessVal = 100 + (expansion * 130);
          // 2000% Contrast provides a very sharp edge that still retains sub-pixel smoothness.
          ctx.filter = `blur(${smoothBlur}px) brightness(${brightnessVal}%) contrast(2500%)`;
        } else {
          ctx.filter = `blur(${smoothness * 2}px) contrast(300%)`;
        }
        
        ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);
        
        // Subject isolation
        ctx.globalCompositeOperation = 'source-in';
        ctx.filter = 'none';
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
        
        ctx.restore();
        
        setResultUrl(canvas.toDataURL('image/png', 1.0));
        setProgress(100);
        setIsProcessing(false);
        URL.revokeObjectURL(objectUrl);
      });

      await segmentation.send({ image: img });
    } catch (error) {
      console.error(error);
      alert(t('ui.error_bg_remover_failed'));
      setIsProcessing(false);
    }
  };

  if (!file) {
    return <Dropzone onFilesSelected={handleFiles} accept="image/*" lang={lang} />;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Preview Area */}
        <div className="bg-zinc-100 rounded-[2.5rem] p-8 flex items-center justify-center relative overflow-hidden border border-zinc-200 shadow-inner min-h-[500px]">
          {!resultUrl ? (
            <div className="relative group">
              <img src={URL.createObjectURL(file)} className="max-h-[500px] w-auto rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]" alt="Original" />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
            </div>
          ) : (
            <div className="relative group">
               {/* Premium transparency grid */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 bg-zinc-300"></div>
              <img src={resultUrl} className="relative z-10 max-h-[500px] w-auto rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]" alt="Result" />
            </div>
          )}
        </div>

        {/* Controls Area */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-zinc-900 font-outfit flex items-center gap-2">
                  <ImageIcon className="text-zinc-400" size={20} />
                  {t('tool.background-remover.title')}
                </h3>
                <div className="flex items-center gap-2 bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-500">{t('ui.pro_engine')}</span>
                  <input 
                    type="checkbox" 
                    checked={hdMode} 
                    onChange={(e) => setHdMode(e.target.checked)}
                    className="w-4 h-4 accent-zinc-900 cursor-pointer"
                  />
                </div>
              </div>
              <p className="text-zinc-500 text-sm">
                {t('ui.bg_remover_desc')}
              </p>
            </div>

            {!resultUrl && !isProcessing && (
              <div className="space-y-6 pt-4 border-t border-zinc-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                        <Eraser size={14} /> {t('ui.edge_smooth')}
                      </label>
                      <span className="text-xs font-mono font-bold bg-zinc-100 px-2 py-1 rounded">{smoothness}px</span>
                    </div>
                    <input 
                      type="range" min="0" max="5" step="0.1" 
                      value={smoothness} 
                      onChange={(e) => setSmoothness(parseFloat(e.target.value))}
                      className="w-full accent-zinc-900"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                        {t('ui.shrink_grow')}
                      </label>
                      <span className="text-xs font-mono font-bold bg-zinc-100 px-2 py-1 rounded">{expansion > 0 ? '+' : ''}{Math.round(expansion * 100)}%</span>
                    </div>
                    <input 
                      type="range" min="-1" max="1" step="0.05" 
                      value={expansion} 
                      onChange={(e) => setExpansion(parseFloat(e.target.value))}
                      className="w-full accent-zinc-900"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                    {t('ui.refinement')}
                  </label>
                  <input 
                    type="range" min="0.1" max="2" step="0.1" 
                    value={sensitivity} 
                    onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                    className="w-full accent-zinc-900"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                    {t('ui.ai_engine')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setModelType(0)}
                      className={`py-4 rounded-2xl text-xs font-bold border-2 transition-all flex flex-col items-center gap-1 ${modelType === 0 ? 'border-zinc-900 bg-zinc-900 text-white shadow-xl shadow-zinc-200' : 'border-zinc-100 text-zinc-400 hover:border-zinc-200'}`}
                    >
                      <Zap size={14} />
                      {t('ui.fast_standard')}
                    </button>
                    <button 
                      onClick={() => setModelType(1)}
                      className={`py-4 rounded-2xl text-xs font-bold border-2 transition-all flex flex-col items-center gap-1 ${modelType === 1 ? 'border-zinc-900 bg-zinc-900 text-white shadow-xl shadow-zinc-200' : 'border-zinc-100 text-zinc-400 hover:border-zinc-200'}`}
                    >
                      <ShieldCheck size={14} />
                      {t('ui.pro_accuracy')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 space-y-4">
              {!resultUrl ? (
                <button 
                  onClick={removeBackground}
                  disabled={isProcessing}
                  className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Eraser size={20} />}
                  {isProcessing ? t('ui.processing_ai') : t('tool.background-remover.title')}
                </button>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => {
                      if (!resultUrl) return;
                      const link = document.createElement('a');
                      link.href = resultUrl;
                      link.download = `lumea-no-bg-${file.name.split('.')[0]}.png`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
                  >
                    <Download size={20} />
                    {t('ui.download')} PNG
                  </button>
                  <button 
                    onClick={() => { setFile(null); setResultUrl(null); setProgress(0); }}
                    className="w-full py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-bold hover:bg-zinc-50 transition-all text-sm"
                  >
                    {t('ui.clear')}
                  </button>
                </div>
              )}
            </div>

            {isProcessing && (
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  <span>{t('ui.extracting')}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-zinc-900 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
