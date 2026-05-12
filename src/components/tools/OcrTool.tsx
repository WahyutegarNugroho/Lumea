import { useState, useRef, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import { Dropzone } from '../ui/Dropzone';
import { Download, Copy, ScanText, ShieldCheck, Languages, Zap, Check, Trash2, Wand2 } from 'lucide-react';
import { useTranslations, type Locale } from '../../lib/i18n';

interface Props {
  lang?: Locale;
}

const OCR_LANGS = [
  { code: 'eng', name: 'English' },
  { code: 'ind', name: 'Bahasa Indonesia' },
  { code: 'spa', name: 'Español' },
];

export default function OcrTool({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrLang, setOcrLang] = useState('eng');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile));
    setResult('');
  };

  // Pre-process image to improve OCR accuracy
  const preprocessImage = (imageElement: HTMLImageElement): string => {
    const canvas = canvasRef.current;
    if (!canvas) return imageElement.src;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return imageElement.src;

    canvas.width = imageElement.width;
    canvas.height = imageElement.height;

    // Draw original image
    ctx.drawImage(imageElement, 0, 0);

    // Apply Grayscale and Contrast enhancement
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      // High contrast thresholding
      const val = avg > 128 ? 255 : 0; 
      data[i] = data[i + 1] = data[i + 2] = val;
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
  };

  const processOCR = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);

    try {
      const img = new Image();
      img.src = imagePreview!;
      await new Promise(resolve => img.onload = resolve);
      
      // Use pre-processed image for OCR
      const processedSrc = preprocessImage(img);

      const worker = await createWorker(ocrLang, 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });
      
      const { data: { text } } = await worker.recognize(processedSrc);
      
      // Post-process: Clean up text
      const cleanedText = text
        .replace(/[^\x20-\x7E\n\r\t\u00A0-\u00FF\u0100-\u017F\u0180-\u024F]/g, '') // Remove weird chars
        .replace(/\n\s*\n/g, '\n\n') // Normalize paragraphs
        .trim();

      setResult(cleanedText);
      await worker.terminate();
    } catch (error) {
      console.error(error);
      alert(t('ui.error_ocr_failed'));
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!file) {
    return <Dropzone onFilesSelected={handleFiles} accept="image/*" lang={lang} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Input/Preview Area */}
        <div className="space-y-6">
          <div className="bg-zinc-50 border border-zinc-200 rounded-[2.5rem] p-4 shadow-inner overflow-hidden flex items-center justify-center min-h-[400px] relative group">
            <img src={imagePreview!} alt="Preview" className="max-w-full max-h-[600px] rounded-2xl shadow-2xl transition-transform group-hover:scale-[1.01] duration-500" />
            <div className="absolute top-6 right-6 flex gap-2">
               <button 
                onClick={() => { setFile(null); setImagePreview(null); }}
                className="w-10 h-10 bg-white/90 backdrop-blur text-rose-500 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-500 hover:text-white transition-all"
               >
                 <Trash2 size={18} />
               </button>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Languages size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm leading-tight">{t('ui.ocr_lang')}</h4>
                  <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mt-1">AI Language Engine</p>
                </div>
              </div>
              <select 
                value={ocrLang}
                onChange={(e) => setOcrLang(e.target.value)}
                disabled={isProcessing}
                className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none cursor-pointer"
              >
                {OCR_LANGS.map(l => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>

            {!isProcessing ? (
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={processOCR}
                  className="flex-1 py-5 bg-zinc-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-2xl shadow-zinc-200 hover:scale-[1.02] active:scale-95"
                >
                  <Wand2 size={22} className="text-amber-400" />
                  {t('ui.extract_text')}
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-zinc-900 rounded-full animate-ping" />
                    {t('ui.processing_ocr')}
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden p-0.5 border border-zinc-200">
                  <div 
                    className="h-full bg-zinc-900 rounded-full transition-all duration-300 relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                  >
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Result Area */}
        <div className="space-y-6">
          <div className="bg-zinc-950 rounded-[2rem] border border-zinc-800 shadow-2xl overflow-hidden min-h-[650px] flex flex-col group animate-in zoom-in-95 duration-300">
             <div className="flex items-center justify-between p-8 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl rounded-t-[2rem]">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
                      <ScanText size={20} className="text-zinc-500" />
                   </div>
                   <h4 className="text-white font-bold font-outfit text-lg">AI Result</h4>
                </div>
                {result && (
                  <button 
                    onClick={copyToClipboard}
                    className="px-6 py-2 bg-white text-zinc-900 rounded-xl transition-all flex items-center gap-2 font-bold text-xs hover:bg-zinc-200 active:scale-95"
                  >
                    {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                    {copied ? 'Copied' : 'Copy Text'}
                  </button>
                )}
             </div>

             <div className="flex-1 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-zinc-950 to-transparent pointer-events-none z-10 rounded-tr-[2rem]"></div>
                {result ? (
                  <textarea 
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    className="w-full h-full min-h-[500px] bg-transparent border-none text-zinc-300 text-lg leading-relaxed focus:ring-0 resize-none font-medium custom-scrollbar selection:bg-zinc-700"
                    placeholder="Result will appear here..."
                  />
                ) : (
                  <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center space-y-6 animate-pulse">
                    <div className="w-24 h-24 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center border border-zinc-800 shadow-2xl">
                        <Zap size={48} className="text-zinc-700" />
                    </div>
                    <div className="space-y-2">
                       <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Ready for Scan</p>
                       <p className="text-zinc-700 text-xs max-w-[200px]">Click the magic wand to extract text from your image.</p>
                    </div>
                  </div>
                )}
                <ScanText className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 -rotate-12 group-hover:rotate-0 transition-all duration-700 pointer-events-none" />
             </div>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-[2rem] p-6 flex gap-5 items-start">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-emerald-900 text-sm">Enhanced Neural Processing</h4>
              <p className="text-emerald-700/70 text-xs leading-relaxed">
                Kami kini menerapkan pra-pemrosesan gambar otomatis untuk meningkatkan kontras dan ketajaman teks sebelum pemindaian AI dilakukan. Hasilnya jauh lebih akurat pada gambar buram atau gelap.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
