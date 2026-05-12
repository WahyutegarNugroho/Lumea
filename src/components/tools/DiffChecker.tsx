import { useState } from 'react';
import { Columns2, ArrowLeftRight, Trash2, Zap, Info } from 'lucide-react';
import { useTranslations, type Locale } from '../../lib/i18n';

interface Props {
  lang?: Locale;
}

interface DiffLine {
  type: 'same' | 'added' | 'removed';
  value: string;
  parts?: { type: 'same' | 'added' | 'removed'; value: string }[];
}

export default function DiffChecker({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [isCompared, setIsCompared] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [diffLines, setDiffLines] = useState<DiffLine[]>([]);

  // INTERNAL LIGHTWEIGHT DIFF ENGINE (LCS Based)
  const computeDiff = (oldArr: string[], newArr: string[]) => {
    const n = oldArr.length;
    const m = newArr.length;
    const matrix = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        if (oldArr[i - 1] === newArr[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1] + 1;
        } else {
          matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
        }
      }
    }

    const result: { type: 'same' | 'added' | 'removed'; value: string }[] = [];
    let i = n, j = m;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && oldArr[i - 1] === newArr[j - 1]) {
        result.unshift({ type: 'same', value: oldArr[i - 1] });
        i--; j--;
      } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
        result.unshift({ type: 'added', value: newArr[j - 1] });
        j--;
      } else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
        result.unshift({ type: 'removed', value: oldArr[i - 1] });
        i--;
      }
    }
    return result;
  };

  const compareTexts = () => {
    setIsProcessing(true);
    
    // Process in a short timeout to allow UI to update (spinner)
    setTimeout(() => {
      const lines1 = text1.split(/\r?\n/);
      const lines2 = text2.split(/\r?\n/);
      
      const changes = computeDiff(lines1, lines2);
      const processed: DiffLine[] = [];

      for (let i = 0; i < changes.length; i++) {
        const change = changes[i];
        const nextChange = changes[i + 1];

        // Advanced internal logic to detect modifications within lines
        if (change.type === 'removed' && nextChange && nextChange.type === 'added') {
          // Tokenize by words/chars for inline diff
          const tokens1 = change.value.split(/(\s+)/);
          const tokens2 = nextChange.value.split(/(\s+)/);
          const wordDiff = computeDiff(tokens1, tokens2);

          processed.push({
            type: 'removed',
            value: change.value,
            parts: wordDiff.filter(d => d.type !== 'added')
          });
          processed.push({
            type: 'added',
            value: nextChange.value,
            parts: wordDiff.filter(d => d.type !== 'removed')
          });
          i++;
        } else {
          processed.push({
            type: change.type,
            value: change.value
          });
        }
      }

      setDiffLines(processed);
      setIsCompared(true);
      setIsProcessing(false);
    }, 50);
  };

  const clear = () => {
    setText1('');
    setText2('');
    setIsCompared(false);
    setDiffLines([]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {!isCompared ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{t('ui.original_text')}</label>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{t('ui.original')}</span>
              </div>
            </div>
            <textarea
              className="tool-input min-h-[600px] font-mono text-sm p-8 leading-relaxed bg-zinc-50 border-zinc-200 focus:bg-white transition-all shadow-inner rounded-[2.5rem]"
              placeholder={t('ui.paste_original')}
              value={text1}
              onChange={(e) => setText1(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{t('ui.changed_text')}</label>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{t('ui.modified')}</span>
              </div>
            </div>
            <textarea
              className="tool-input min-h-[600px] font-mono text-sm p-8 leading-relaxed bg-zinc-50 border-zinc-200 focus:bg-white transition-all shadow-inner rounded-[2rem]"
              placeholder={t('ui.paste_modified')}
              value={text2}
              onChange={(e) => setText2(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="bg-zinc-950 rounded-[2rem] border border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between p-8 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl rounded-t-[2rem]">
            <h3 className="text-white font-bold font-outfit text-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
                <Columns2 size={20} className="text-zinc-500" />
              </div>
              {t('ui.comp_result')}
            </h3>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsCompared(false)}
                className="px-6 py-2 bg-zinc-900 text-zinc-400 hover:text-white rounded-xl text-xs font-bold border border-zinc-800 transition-all active:scale-95"
              >
                {t('ui.edit_input')}
              </button>
              <button 
                onClick={clear}
                className="px-6 py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                {t('ui.clear')}
              </button>
            </div>
          </div>

          <div className="bg-zinc-950 p-6 font-mono text-[13px] leading-relaxed max-h-[70vh] overflow-y-auto custom-scrollbar relative">
            <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-zinc-950 to-transparent pointer-events-none z-10 rounded-tr-[2rem]"></div>
            {diffLines.length === 0 ? (
              <div className="py-20 text-center text-zinc-600 font-bold italic">
                {t('ui.no_diff')}
              </div>
            ) : (
              diffLines.map((line, idx) => (
                <div 
                  key={idx}
                  className={`group flex items-start gap-4 min-h-[1.5rem] ${
                    line.type === 'added' ? 'bg-emerald-500/5' :
                    line.type === 'removed' ? 'bg-rose-500/5' : ''
                  }`}
                >
                  <div className={`w-12 shrink-0 select-none text-[10px] font-bold text-center py-1 rounded-md transition-colors ${
                    line.type === 'added' ? 'text-emerald-500/40 bg-emerald-500/10' :
                    line.type === 'removed' ? 'text-rose-500/40 bg-rose-500/10' :
                    'text-zinc-800'
                  }`}>
                    {idx + 1}
                  </div>
                  
                  <div className={`w-6 shrink-0 select-none text-center font-black ${
                    line.type === 'added' ? 'text-emerald-500' :
                    line.type === 'removed' ? 'text-rose-500' :
                    'text-zinc-800'
                  }`}>
                    {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                  </div>

                  <div className={`flex-1 whitespace-pre-wrap py-0.5 px-2 rounded ${
                    line.type === 'added' ? 'text-emerald-300' :
                    line.type === 'removed' ? 'text-rose-300' :
                    'text-zinc-500'
                  }`}>
                    {line.parts ? (
                      line.parts.map((part, pIdx) => (
                        <span 
                          key={pIdx} 
                          className={
                            part.type === 'added' ? 'bg-emerald-500/40 text-white font-bold px-0.5 rounded shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                            part.type === 'removed' ? 'bg-rose-500/40 text-white font-bold px-0.5 rounded shadow-[0_0_10px_rgba(244,63,94,0.3)]' :
                            ''
                          }
                        >
                          {part.value}
                        </span>
                      ))
                    ) : (
                      line.value || ' '
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Action Bar */}
      {!isCompared && (
        <div className="flex justify-center pt-8">
          <button 
            onClick={compareTexts}
            disabled={isProcessing}
            className={`group relative px-12 py-6 bg-zinc-900 text-white rounded-3xl font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-zinc-200 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex items-center gap-3">
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Zap size={22} className="text-amber-400" />
              )}
              {isProcessing ? t('ui.processing') : t('ui.compare_now')}
            </div>
          </button>
        </div>
      )}

      {/* Guide Area */}
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-10 shadow-sm flex items-start gap-8">
        <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center shrink-0">
          <Info className="text-zinc-400" />
        </div>
        <div className="space-y-3">
          <h4 className="text-lg font-bold text-zinc-900">{t('ui.zero_dep_engine')}</h4>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-3xl">
            {t('ui.zero_dep_desc')}
          </p>
        </div>
      </div>
    </div>
  );
}
