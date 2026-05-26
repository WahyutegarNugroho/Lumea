import { ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface PrivacyShieldCardProps {
  t: (key: string) => string;
  descKey: string;
  decorIcon: LucideIcon;
}

export function PrivacyShieldCard({ t, descKey, decorIcon: DecorIcon }: PrivacyShieldCardProps) {
  return (
    <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2 text-zinc-500">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-widest">{t('ui.privacy_shield')}</span>
        </div>
        <h4 className="text-xl font-bold font-outfit">{t('ui.pro_tip')}</h4>
        <p className="text-zinc-500 text-sm leading-relaxed">{t(descKey)}</p>
      </div>
      <DecorIcon className="absolute -bottom-8 -right-8 w-32 h-32 text-white/5 -rotate-12" />
    </div>
  );
}
