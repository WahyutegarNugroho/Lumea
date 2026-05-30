import { withErrorBoundary } from '../ui/withErrorBoundary';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Copy, Braces, ShieldCheck, Zap, Check, RefreshCw } from 'lucide-react';
import { useTranslations } from '../../lib/i18n';
import { useCopyToClipboard } from '../../lib/hooks/useCopyToClipboard';

interface Props {
  lang?: string;
}

const LANGUAGES: Array<{ id: string; name: string }> = [
  { id: 'babel', name: 'ui.lang_js_json' },
  { id: 'html', name: 'ui.lang_html' },
  { id: 'css', name: 'ui.lang_css' },
];

function CodeFormatter({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const { copied, copy } = useCopyToClipboard();
  const [code, setCode] = useState('');
  const [selectedLang, setSelectedLang] = useState('babel');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCode = async () => {
    if (!code.trim()) return;
    setIsProcessing(true);

    try {
      const [{ format }, { default: parserBabel }, { default: parserHtml }, { default: parserPostcss }] = await Promise.all([
        import('prettier/standalone'),
        import('prettier/parser-babel'),
        import('prettier/parser-html'),
        import('prettier/parser-postcss'),
      ]);
      const formatted = await format(code, {
        parser: selectedLang,
        plugins: [parserBabel, parserHtml, parserPostcss],
        semi: true,
        singleQuote: true,
        tabWidth: 2,
      });
      setCode(formatted);
    } catch (error) {
      console.error(error);
      toast(t('ui.error_format_failed'));
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    copy(code);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-zinc-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden group min-h-[600px] flex flex-col border border-white/5">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-50 dark:bg-zinc-900/80 shadow-[0_0_8px_rgba(244,63,94,0.4)]"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-50 dark:bg-zinc-900/80 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-50 dark:bg-zinc-900/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={copyToClipboard}
                  className="px-6 py-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-xl transition-all flex items-center gap-2 font-bold text-xs hover:bg-zinc-200 active:scale-95"
                >
                  {copied ? <Check size={16} className="text-zinc-600 dark:text-zinc-400" /> : <Copy size={16} />}
                  <span>{copied ? t('ui.copied') : t('ui.copy')}</span>
                </button>
              </div>
            </div>

            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t('ui.paste_messy_code')}
              className="flex-1 bg-transparent border-none text-zinc-300 font-mono text-sm leading-relaxed focus:ring-0 resize-none placeholder:text-zinc-700 dark:text-zinc-300 relative z-10 custom-scrollbar selection:bg-zinc-700"
            />
            
            <Braces className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 -rotate-12 group-hover:rotate-0 transition-all duration-1000 pointer-events-none" />
          </div>
        </div>

        {/* Controls Area */}
        <div className="space-y-6 flex flex-col justify-center">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-zinc-900 rounded-full"></div>
                <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{t('ui.select_lang')}</label>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {LANGUAGES.map(l => (
                  <button 
                    key={l.id}
                    onClick={() => setSelectedLang(l.id)}
                    className={`w-full py-4 px-5 rounded-2xl text-sm font-bold text-left transition-all border ${selectedLang === l.id ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl shadow-zinc-200' : 'bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:bg-zinc-950 hover:border-zinc-200 dark:hover:border-zinc-700 dark:border-zinc-800'}`}
                  >
                    {t(l.name)}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={formatCode}
              disabled={isProcessing || !code.trim()}
              className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-2xl shadow-zinc-200 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 active:scale-95"
            >
              {isProcessing ? <RefreshCw size={22} className="animate-spin text-emerald-400" /> : <Zap size={22} className="text-amber-400 fill-amber-400" />}
              {t('ui.beautify_code')}
            </button>
          </div>


          <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/50 rounded-3xl p-6 flex gap-4 items-start">
            <div className="p-2 bg-zinc-100 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 rounded-xl">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-blue-900 text-sm mb-1">{t('ui.privacy_shield')}</h4>
              <p className="text-blue-700/70 text-xs leading-relaxed">
                {t('ui.code_privacy_desc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withErrorBoundary(CodeFormatter);
