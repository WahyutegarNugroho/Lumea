import { withErrorBoundary } from '../ui/withErrorBoundary';
import { PrivacyShieldCard } from '../ui/PrivacyShieldCard';
import toast from 'react-hot-toast';
import { useState, useEffect, useRef } from 'react';
import { Dropzone } from '../ui/Dropzone';
import { Stamp, Type, Shield, Move, RotateCw, Maximize } from 'lucide-react';
import { useTranslations } from '../../lib/i18n';
import { useDownload } from '../../lib/hooks/useDownload';
import { loadPdfDocument, renderPageToDataUrl } from '../../lib/pdfUtils';

interface Props {
  lang?: string;
}

function PdfWatermark({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const { download } = useDownload();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState(t('ui.confidential'));

  const [opacity, setOpacity] = useState(0.3);
  const [fontSize, setFontSize] = useState(60);
  const [rotation, setRotation] = useState(45);
  const [posX, setPosX] = useState(50); // percentage 0-100
  const [posY, setPosY] = useState(50); // percentage 0-100
  const [color, setColor] = useState('#000000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const previewImgRef = useRef<HTMLImageElement>(null);

  const hexToRgb = (hex: string) => {
    try {
      const cleanHex = hex.replace('#', '');
      const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
      const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
      const b = parseInt(cleanHex.slice(4, 6), 16) / 255;
      return { 
        r: isNaN(r) ? 0 : r, 
        g: isNaN(g) ? 0 : g, 
        b: isNaN(b) ? 0 : b 
      };
    } catch (e) {
      console.error('Hex parse error:', e);
      return { r: 0, g: 0, b: 0 };
    }
  };

  const COLORS = [
    '#000000', '#71717a', '#ef4444', '#f97316', '#f59e0b', 
    '#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef'
  ];

  const handleFiles = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    generatePreview(selectedFile);
  };

  const generatePreview = async (file: File) => {
    try {
      const pdf = await loadPdfDocument(file);
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.0 });

      setPageSize({ width: viewport.width, height: viewport.height });

      const dataUrl = await renderPageToDataUrl(page, 1.0);
      setPreviewUrl(dataUrl);
    } catch (err) {
      console.error('Preview Error:', err);
      toast(t('ui.error_pdf_load'));
    }
  };

  const [fontMetrics, setFontMetrics] = useState<{ width: number; vOffset: number } | null>(null);

  // Sync metrics between preview and PDF
  useEffect(() => {
    let isMounted = true;
    const loadMetrics = async () => {
      try {
        const { PDFDocument, StandardFonts } = await import('pdf-lib');
        const doc = await PDFDocument.create();
        const font = await doc.embedFont(StandardFonts.HelveticaBold);
        if (isMounted) {
          const width = font.widthOfTextAtSize(watermarkText, fontSize);
          const ascent = font.heightAtSize(fontSize);
          // Use cap height (~90% of ascent) for better visual centering of watermark text
          const capHeight = ascent * 0.92;
          setFontMetrics({ width, vOffset: capHeight / 2 });
        }
      } catch (e) {
        console.error("Metrics calc error:", e);
        if (isMounted) toast('Failed to calculate font metrics');
      }
    };
    loadMetrics();
    return () => { isMounted = false; };
  }, [watermarkText, fontSize]);

  const calculateOrigin = (cx: number, cy: number, tWidth: number, vOffset: number, angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx - (tWidth / 2) * Math.cos(rad) + vOffset * Math.sin(rad),
      y: cy - (tWidth / 2) * Math.sin(rad) - vOffset * Math.cos(rad)
    };
  };

  const applyWatermark = async () => {
    if (!file || !watermarkText || !fontMetrics) return;
    setIsProcessing(true);

    try {
      const { PDFDocument, rgb, StandardFonts, degrees } = await import('pdf-lib');
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();
      const { r, g, b } = hexToRgb(color);

      for (const page of pages) {
        const { width, height } = page.getSize();
        const cropBox = page.getCropBox();
        
        // Coordinates relative to the visible area (CropBox)
        const cx = (posX / 100) * width;
        const cy = (posY / 100) * height;

        const { x, y } = calculateOrigin(cx, cy, fontMetrics.width, fontMetrics.vOffset, rotation);

        // Add the CropBox offset to draw at the correct absolute position
        page.drawText(watermarkText, {
          x: x + (cropBox.x || 0),
          y: y + (cropBox.y || 0),
          size: fontSize,
          font: helveticaBold,
          color: rgb(r, g, b),
          opacity: opacity,
          rotate: degrees(rotation),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer] as BlobPart[], { type: 'application/pdf' });
      download(blob, `watermarked-${file.name}`);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('ui.error_unknown');
      console.error('Watermark Error:', err);
      toast(`${t('ui.error')}: ${msg}`);

      setIsProcessing(false);
    }
  };

  if (!file) {
    return <Dropzone onFilesSelected={handleFiles} accept="application/pdf" lang={lang} />;
  }

  // Calculate coordinates for preview
  const previewCx = (posX / 100) * pageSize.width;
  const previewCy = (posY / 100) * pageSize.height;
  const previewPos = fontMetrics 
    ? calculateOrigin(previewCx, previewCy, fontMetrics.width, fontMetrics.vOffset, rotation)
    : { x: 0, y: 0 };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Preview Area */}
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-3xl p-8 flex items-center justify-center relative overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-inner min-h-[500px]">
          {previewUrl ? (
            <div className="relative shadow-2xl rounded-lg overflow-hidden bg-white dark:bg-zinc-900 max-w-full" style={{ width: 'fit-content' }}>
              <img 
                ref={previewImgRef}
                src={previewUrl} 
                className="max-h-[600px] w-auto block" 
                alt="PDF Preview" 
              />
              
              {/* SVG Overlay for perfect coordinate matching */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox={`0 0 ${pageSize.width} ${pageSize.height}`}
                preserveAspectRatio="xMidYMid meet"
              >
                {fontMetrics && (
                  <text
                    x={previewPos.x}
                    y={pageSize.height - previewPos.y}
                    fill={color}
                    opacity={opacity}
                    fontSize={fontSize}
                    fontFamily="Helvetica, Arial, sans-serif"
                    fontWeight="bold"
                    transform={`rotate(${-rotation}, ${previewPos.x}, ${pageSize.height - previewPos.y})`}
                  >
                    {watermarkText}
                  </text>
                )}
              </svg>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-zinc-500 dark:text-zinc-400">
              <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-400 rounded-full animate-spin"></div>
              <span className="font-bold text-sm uppercase tracking-widest">{t('ui.loading_preview')}</span>
            </div>
          )}
        </div>

        {/* Controls Area */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-8">
            <div className="space-y-4">
              <label className="tool-label flex items-center gap-2">
                <Type size={14} />
                {t('ui.watermark_config')}
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${color === c ? 'border-zinc-900 scale-110 shadow-md' : 'border-zinc-200 dark:border-zinc-800 hover:scale-110'}`}
                    style={{ backgroundColor: c }}
                    aria-label={c}
                  />
                ))}
                <div className="relative w-7 h-7 rounded-full border-2 border-zinc-200 dark:border-zinc-800 overflow-hidden group">
                  <input 
                    type="color" 
                    value={color} 
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute inset-0 w-full h-full scale-150 cursor-pointer"
                  />
                </div>
              </div>
              <input 
                type="text" 
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="tool-input bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-lg font-bold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Position Controls */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="tool-label m-0 flex items-center gap-2"><Move size={14} /> {t('ui.horizontal')}</label>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">{posX}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={posX} onChange={(e) => setPosX(parseInt(e.target.value))} className="w-full accent-zinc-900 dark:accent-zinc-100" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="tool-label m-0 flex items-center gap-2"><Move size={14} /> {t('ui.vertical')}</label>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">{posY}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={posY} onChange={(e) => setPosY(parseInt(e.target.value))} className="w-full accent-zinc-900 dark:accent-zinc-100" />
                </div>
              </div>

              {/* Style Controls */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="tool-label m-0 flex items-center gap-2"><RotateCw size={14} /> {t('ui.rotation')}</label>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">{rotation}°</span>
                  </div>
                  <input type="range" min="0" max="360" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))} className="w-full accent-zinc-900 dark:accent-zinc-100" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="tool-label m-0 flex items-center gap-2"><Maximize size={14} /> {t('ui.font_size')}</label>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">{fontSize}px</span>
                  </div>
                  <input type="range" min="10" max="200" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-zinc-900 dark:accent-zinc-100" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="tool-label m-0 flex items-center gap-2"><Shield size={14} /> {t('ui.opacity')}</label>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">{Math.round(opacity * 100)}%</span>
              </div>
              <input type="range" min="0.05" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-full accent-zinc-900 dark:accent-zinc-100" />
            </div>

            <div className="pt-6 space-y-3 border-t border-zinc-100 dark:border-zinc-800">
              <button 
                onClick={applyWatermark}
                disabled={isProcessing || !watermarkText}
                className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
              >
                {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Stamp size={20} />}
                {t('ui.apply_download')}
              </button>
              <button onClick={() => setFile(null)} className="w-full py-4 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:bg-zinc-950 transition-all text-sm">
                {t('ui.change_pdf')}
              </button>
            </div>
          </div>

          <PrivacyShieldCard t={t} descKey="ui.watermark_privacy_desc" decorIcon={Stamp} />
        </div>
      </div>
    </div>
  );
}

export default withErrorBoundary(PdfWatermark);
