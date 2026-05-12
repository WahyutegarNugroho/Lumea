import { useState, useEffect } from 'react';
import { marked } from 'marked';
import { 
  FileText, 
  Eye, 
  Code, 
  Copy, 
  Download, 
  Check, 
  RotateCcw,
  ShieldCheck,
  Type
} from 'lucide-react';
import { useTranslations, type Locale } from '../../lib/i18n';

interface Props {
  lang?: Locale;
}

export default function MarkdownEditor({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const [markdown, setMarkdown] = useState(t('ui.markdown_placeholder'));
  const [html, setHtml] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'split'>('split');

  useEffect(() => {
    const renderMarkdown = async () => {
      const rendered = await marked.parse(markdown);
      setHtml(rendered);
    };
    renderMarkdown();
  }, [markdown]);

  const copyHtml = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Header / Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-zinc-200 rounded-3xl p-4 shadow-sm">
        <div className="flex p-1 bg-zinc-100 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'editor' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            <Code size={14} />
            {t('ui.editor')}
          </button>
          <button 
            onClick={() => setActiveTab('split')}
            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'split' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            <FileText size={14} />
            {t('ui.dual_view')}
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            <Eye size={14} />
            {t('ui.preview')}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={copyHtml}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl text-xs font-bold transition-all"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
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
          <div className="flex flex-col bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Code size={12} />
                {t('ui.markdown_editor')}
              </span>
              <button 
                onClick={() => setMarkdown('')}
                className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
                title={t('ui.clear_all')}
              >
                <RotateCcw size={14} />
              </button>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="flex-1 w-full p-8 font-mono text-sm resize-none focus:outline-none bg-transparent leading-relaxed"
              placeholder={t('ui.placeholder_text')}
            />
          </div>
        )}

        {/* Preview Pane */}
        {(activeTab === 'preview' || activeTab === 'split') && (
          <div className="flex flex-col bg-zinc-50 border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-inner">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center bg-white/50">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Eye size={12} />
                {t('ui.preview')}
              </span>
            </div>
            <div 
              className="flex-1 w-full p-8 overflow-y-auto prose prose-zinc max-w-none prose-sm md:prose-base prose-headings:font-outfit prose-headings:font-bold prose-a:text-zinc-900 prose-strong:text-zinc-900"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}
      </div>

      {/* Privacy Note */}
      <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t('ui.privacy_shield')}</span>
          </div>
          <h4 className="text-xl font-bold font-outfit">{t('ui.pro_tip')}</h4>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
            {t('ui.markdown_privacy_desc')}
          </p>
        </div>
        <Type className="absolute -bottom-8 -right-8 w-32 h-32 text-white/5 -rotate-12" />
      </div>
    </div>
  );
}
