import { ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface PrivacyShieldCardProps {
  t: (key: string) => string;
  descKey: string;
  decorIcon: LucideIcon;
  titleKey?: string;
  badgeKey?: string;
}

export function PrivacyShieldCard({
  t,
  descKey,
  decorIcon: DecorIcon,
  titleKey = 'ui.privacy_card_title',
  badgeKey = 'ui.local_processing_badge',
}: PrivacyShieldCardProps) {
  return (
    <div className="bg-zinc-900 rounded-2xl p-8 text-white relative overflow-hidden">
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2 text-zinc-500">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-widest">{t(badgeKey)}</span>
        </div>
        <h4 className="text-xl font-bold font-outfit">{t(titleKey)}</h4>
        <p className="text-zinc-500 text-sm leading-relaxed">{t(descKey)}</p>
      </div>
      <DecorIcon className="absolute -bottom-8 -right-8 w-32 h-32 text-white/5 -rotate-12" />
    </div>
  );
}
