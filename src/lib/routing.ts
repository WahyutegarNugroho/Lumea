import { SUPPORTED_LOCALES } from './i18n';

/**
 * Mendapatkan parameter getStaticPaths untuk rute multibahasa Astro.
 * Menghasilkan [{params: {lang: undefined}}, {params: {lang: 'id'}}, ...]
 */
export function getI18nPaths() {
  return [
    { params: { lang: undefined } },
    ...SUPPORTED_LOCALES.filter(l => l !== 'en').map(lang => ({
      params: { lang }
    }))
  ];
}

/**
 * Mendapatkan parameter statis untuk halaman blog/guide yang terintegrasi i18n.
 */
export function getI18nContentPaths(slugs: string[]) {
  const paths: Array<{ params: { lang: string | undefined; slug: string } }> = [];
  
  slugs.forEach(slug => {
    // English (default)
    paths.push({ params: { lang: undefined, slug } });
    
    // Other languages
    SUPPORTED_LOCALES.filter(l => l !== 'en').forEach(lang => {
      paths.push({ params: { lang, slug } });
    });
  });
  
  return paths;
}
