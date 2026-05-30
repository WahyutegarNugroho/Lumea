import { withErrorBoundary } from '../ui/withErrorBoundary';
import { useState, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import {
  FileText, Eye, Code, Copy, Download, Check, RotateCcw
} from 'lucide-react';
import { useTranslations } from '../../lib/i18n';
import { useDownload } from '../../lib/hooks/useDownload';
import { useCopyToClipboard } from '../../lib/hooks/useCopyToClipboard';

interface Props {
  lang?: string;
}

function MarkdownEditor({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const { download } = useDownload();
  const { copied, copy } = useCopyToClipboard();
  const [markdown, setMarkdown] = useState(t('ui.markdown_placeholder'));
  const [html, setHtml] = useState('');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'split'>('split');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rendered = await marked.parse(markdown);
        if (!cancelled) setHtml(rendered);
      } catch {
        if (!cancelled) setHtml('<p class="text-red-500">Failed to render markdown</p>');
      }
    })();
    return () => { cancelled = true; };
  }, [markdown]);

  const copyHtml = () => {
    copy(html);
  };

  const downloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    download(blob, 'document.md');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Header / Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-sm">
        <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'editor' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:text-zinc-300'}`}
          >
            <Code size={14} />
            {t('ui.editor')}
          </button>
          <button 
            onClick={() => setActiveTab('split')}
            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'split' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:text-zinc-300'}`}
          >
            <FileText size={14} />
            {t('ui.dual_view')}
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:text-zinc-300'}`}
          >
            <Eye size={14} />
            {t('ui.preview')}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={copyHtml}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-900 dark:text-zinc-50 rounded-xl text-xs font-bold transition-all"
          >
            {copied ? <Check size={14} className="text-zinc-600 dark:text-zinc-400" /> : <Copy size={14} />}
            {t('ui.copy_html')}
          </button>
          <button 
            onClick={downloadMd}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-zinc-200"
          >
            <Download size={14} />
            {t('ui.download_md')}
          </button>
        </div>
      </div>

      {/* Editor Main Area */}
      <div className={`grid gap-6 ${activeTab === 'split' ? 'md:grid-cols-2' : 'grid-cols-1'} min-h-[600px]`}>
        {/* Editor Pane */}
        {(activeTab === 'editor' || activeTab === 'split') && (
          <div className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/50">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <Code size={12} />
                {t('ui.markdown_editor')}
              </span>
              <button 
                onClick={() => setMarkdown('')}
                className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-800 rounded-lg transition-all"
                aria-label={t('ui.clear_all')}
              >
                <RotateCcw size={14} />
              </button>
            </div>
            <textarea
              aria-label={t('ui.markdown_editor') || 'Markdown editor'}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="flex-1 w-full p-8 font-mono text-sm resize-none focus:outline-none bg-transparent leading-relaxed"
              placeholder={t('ui.placeholder_text')}
            />
          </div>
        )}

        {/* Preview Pane */}
        {(activeTab === 'preview' || activeTab === 'split') && (
          <div className="flex flex-col bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-inner">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center bg-white dark:bg-zinc-900/50">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <Eye size={12} />
                {t('ui.preview')}
              </span>
            </div>
            <div 
              className="flex-1 w-full p-8 overflow-y-auto prose prose-zinc max-w-none prose-sm md:prose-base prose-headings:font-outfit prose-headings:font-bold prose-a:text-zinc-900 dark:text-zinc-50 prose-strong:text-zinc-900 dark:text-zinc-50"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default withErrorBoundary(MarkdownEditor);
