// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://lumea-whtsn.vercel.app',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), sitemap()],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'id', 'es'],
    routing: {
      prefixDefaultLocale: false
    }
  },

  adapter: vercel()
});