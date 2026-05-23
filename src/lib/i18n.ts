import en from '../locales/en.json';
import id from '../locales/id.json';
import es from '../locales/es.json';

export const translations: Record<string, Record<string, string>> = { en, id, es };

export const SUPPORTED_LOCALES = ['en', 'id', 'es'] as const;
export type Locale = typeof SUPPORTED_LOCALES[number];
export type TranslationKey = keyof typeof en;

export function useTranslations(lang: Locale | string) {
  const safeLang = (SUPPORTED_LOCALES as readonly string[]).includes(lang) ? (lang as Locale) : 'en';
  return function t(key: string | TranslationKey): string {
    const k = key as string;
    return (translations[safeLang] as Record<string, string>)[k] || (translations['en'] as Record<string, string>)[k] || key;
  };
}

export function getLocalizedPath(path: string, lang: Locale | string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (lang === 'en' || !lang) return cleanPath;
  return `/${lang}${cleanPath === '/' ? '' : cleanPath}`;
}

export function getLocaleFromPath(path: string): Locale {
  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0] as string;
  if ((SUPPORTED_LOCALES as readonly string[]).includes(firstSegment)) return firstSegment as Locale;
  return 'en';
}
