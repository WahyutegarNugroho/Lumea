import { FileText, ExternalLink, ShieldCheck, Zap, Info, ArrowRight } from 'lucide-react';
import { useTranslations, type Locale } from '../../lib/i18n';

interface Props {
  lang?: Locale;
}

export default function WordToPdf({ lang = 'en' }: Props) {
  const t = useTranslations(lang);
  const externalLink = "https://www.ilovepdf.com/word_to_pdf";

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Main Card: The Redirector */}
        <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-10 text-center flex flex-col items-center justify-center space-y-8 shadow-xl shadow-zinc-100 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-zinc-900 to-blue-500"></div>
          
          <div className="w-28 h-28 bg-zinc-900 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-zinc-200 group-hover:scale-105 transition-transform duration-500">
            <FileText size={56} />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-zinc-900 font-outfit tracking-tight">
              {t('tool.word-to-pdf.title')}
            </h3>
            <p className="text-zinc-500 font-medium max-w-sm mx-auto leading-relaxed">
              {t('ui.high_fidelity_desc')}
            </p>
          </div>

          <a 
            href={externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-6 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-2xl shadow-zinc-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{t('ui.open_external_tool')}</span>
            <ExternalLink size={20} className="text-blue-400" />
          </a>

          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            {t('ui.powered_by')}
          </p>
        </div>

        {/* Info & Benefits Area */}
        <div className="space-y-6 flex flex-col justify-center">
          <div className="bg-zinc-50/50 border border-zinc-200 rounded-3xl p-8 space-y-8">
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-white border border-zinc-200 text-zinc-900 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <Zap size={24} className="text-amber-500" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-zinc-900 text-lg">{t('ui.why_external')}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                   {t('ui.word_to_pdf_why_desc')}
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-200 flex gap-5">
              <div className="w-12 h-12 bg-white border border-zinc-200 text-zinc-900 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck size={24} className="text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-zinc-900 text-lg">{t('ui.privacy_guaranteed')}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {t('ui.watermark_privacy_desc')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-8 text-white relative overflow-hidden group cursor-pointer" onClick={() => window.open(externalLink, '_blank')}>
             <div className="relative z-10 flex items-center justify-between">
                <div className="space-y-1">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{t('ui.ready_to_convert')}</h5>
                  <p className="text-lg font-bold">{t('ui.start_high_quality')}</p>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={20} />
                </div>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full -mr-16 -mt-16 blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
