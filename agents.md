# Agents.md — Lumea (lumea-app)

> Compact repo-specific guidance for AI agents. Skip these at your own risk.

## Quick start

```bash
npm install        # node >= 22.12.0
npm run dev        # astro dev → http://localhost:4321
npm run build      # astro build → dist/
npm run preview    # astro preview
```

## Verification pipeline (CI order)

```bash
npx astro check    # types + Astro integrity check (runs first)
npm test            # vitest run (jsdom, globals)
npm run build       # fails if check or test fails
npm run lint        # eslint . (separate, not in CI)
npm run format      # prettier --write . (no CI gate)
```

Run single test: `npx vitest src/lib/utils.test.ts`

## Architecture

- **Astro v6** hybrid framework + **React 19** interactive components + **Tailwind CSS v4** (via `@tailwindcss/vite` plugin)
- **100% client-side** — all processing in browser, zero server uploads
- **Vercel adapter** — deployed via `@astrojs/vercel`

## Routing & i18n

- 3 locales: `en` (default, no prefix), `id`, `es` — configured in `astro.config.mjs`
- All content pages use catch-all `[...lang]` directory pattern
- Tool pages: `src/pages/[...lang]/{category}/{tool}.astro`
- Pages must export `getStaticPaths` using `getI18nPaths()` from `src/lib/routing.ts`
- Breadcrumb-safe locale detection via `getLocaleFromPath()` in `src/lib/i18n.ts`

**Tool page template** (every tool follows this):
```astro
---
import { getI18nPaths } from '../../../lib/routing';
export const getStaticPaths = getI18nPaths;
const lang = Astro.params.lang || 'en';
import ToolLayout from '../../../layouts/ToolLayout.astro';
import SomeComponent from '../../../components/tools/SomeComponent';
import { useTranslations } from '../../../lib/i18n';
const t = useTranslations(lang);
---
<ToolLayout title={t('tool.<id>.title')} description={t('tool.<id>.desc')} category="<cat>" toolId="<id>">
  <SomeComponent client:only="react" lang={lang} />
</ToolLayout>
```

## Key directories

| Path | Role |
|------|------|
| `src/pages/[...lang]/` | All routes (pdf/, image/, text/, dev/, blog/) |
| `src/components/tools/` | React interactive tool components |
| `src/components/ui/` | Astro+React shared UI (Layout, ToolCard, etc.) |
| `src/layouts/` | `BaseLayout.astro` (shell) + `ToolLayout.astro` (tool wrapper) |
| `src/lib/` | Shared logic: `i18n.ts`, `routing.ts`, `tools.ts` (tool registry), `utils.ts` |
| `src/locales/` | `en.json`, `id.json`, `es.json` — all UI strings keyed by `tool.<id>.*` |
| `src/content/guides/` | Markdown collection for tool guide pages |

## Tool registry

All 30+ tools are defined in `src/lib/tools.ts` with `{ id, title, description, href, category, icon }`. The `ALL_TOOLS` array drives the homepage grid and command palette. Adding a new tool = add entry here + create page + add locale keys + optionally create React component.

## Important conventions

- React interactive components use `client:only="react"` (never `client:load` or `client:idle`)
- TypeScript with `astro/tsconfigs/strict` base — `allowJs: true`, `resolveJsonModule: true`
- CSS via Tailwind v4 utility classes + `@theme` custom fonts (`--font-outfit`, `--font-inter`)
- Prettier: `semi: true`, `singleQuote: true`, `trailingComma: "es5"`, `printWidth: 100`, `prettier-plugin-astro`
- ESLint: `typescript-eslint` recommended + `eslint-plugin-astro` + `eslint-plugin-react` (prop-types off, using TS)
- `vite` overridden to `^6.0.0` in package.json overrides
- `.astro/` (generated types) and `dist/` are gitignored
- `node_modules` and `.vercel` are gitignored

## Testing

- Vitest with jsdom environment, globals enabled
- Test files: `src/**/*.{test,spec}.{js,ts,jsx,tsx}`
- DOM APIs available (jsdom); mock `document`/`window` as needed
- No integration/E2E test suite currently

## Locale keys

All translatable strings live in `src/locales/*.json` as flat key-value pairs. Pattern:
- `tool.<id>.title` / `tool.<id>.desc` — tool name and description
- `guide.<id>.*` — how-to guide content
- Locale keys can contain dots but are always flat (no nesting in keys — use dot-delimited strings)
