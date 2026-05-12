// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'id', 'es'],
    routing: {
      prefixDefaultLocale: false
    }
  },

  adapter: vercel()
});