# AGENTS.md — AI Agent Knowledge Base
> **Lumea (lumea-app)** | Versi: 1.0 | Bahasa: Bilingual (ID/EN)
> Dokumen ini adalah sumber kebenaran tunggal (*single source of truth*) bagi semua AI Agent yang beroperasi di dalam proyek ini.

---

## PROJECT OVERVIEW

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Astro v6 hybrid + React 19 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite` plugin) |
| Animation | Framer Motion v12 |
| Icons | lucide-react |
| PDF | pdf-lib, jspdf + jspdf-autotable, pdfjs-dist |
| Doc | docx, mammoth |
| QR/Barcode | qrcode, bwip-js |
| Image | html2canvas, imagetracerjs, browser-image-compression, tesseract.js |
| AI/ML | @tensorflow/tfjs-core, @mediapipe/selfie_segmentation |
| Drag & Drop | @dnd-kit/core, @dnd-kit/sortable |
| Utils | clsx, tailwind-merge, dompurify, marked, xlsx |
| Toast | react-hot-toast |
| Deployment | Vercel (`@astrojs/vercel`) |

### Commands
| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Jalankan dev server (port 4321) |
| `npm run build` | Build production ke `dist/` |
| `npm run preview` | Preview production build |
| `npm test` | Jalankan test (vitest, jsdom) |
| `npx astro check` | Type check + Astro integrity |
| `npm run lint` | ESLint (.ts, .tsx, .astro) |
| `npm run format` | Prettier --write |

### Project Structure
```
src/
├── components/
│   ├── tools/           # 26 React interactive tool components (.tsx)
│   └── ui/              # Shared UI (Astro + React): CommandPalette, Dropzone,
│                          ErrorBoundary, ToolCard, ThemeToggle, ToastProvider, etc.
├── layouts/             # BaseLayout.astro (shell) + ToolLayout.astro (tool wrapper)
├── lib/
│   ├── hooks/           # useCopyToClipboard, useDownload
│   ├── i18n.ts          # useTranslations(), getLocaleFromPath(), getLocalizedPath()
│   ├── routing.ts       # getI18nPaths(), getI18nContentPaths()
│   ├── tools.ts         # Tool registry (ALL_TOOLS, ToolDefinition interface)
│   ├── pdfUtils.ts      # PDF utility functions
│   ├── recentTools.ts   # Recent tools state management
│   ├── utils.ts         # General utility functions
│   └── utils.test.ts    # Vitest unit tests
├── locales/             # en.json, id.json, es.json (flat key-value)
├── pages/
│   ├── [...lang]/       # Catch-all locale routes
│   │   ├── pdf/         # 12 PDF tool pages
│   │   ├── image/       # 10 Image tool pages
│   │   ├── text/        # 4 Text tool pages
│   │   ├── dev/         # 8 Developer tool pages
│   │   └── blog/        # Blog listing + catch-all slug
│   ├── index.astro      # English homepage
│   ├── id/index.astro   # Indonesian homepage
│   └── es/index.astro   # Spanish homepage
├── content/
│   └── guides/          # Markdown guides (34 tools × 3 locale = 102 files)
├── content.config.ts    # Zod-validated content collection schema
└── styles/global.css    # Tailwind directives + custom styles
public/                  # Static assets (images, audio, docs, videos)
```

### Routing & i18n
- 3 locales: `en` (default, no prefix), `id`, `es` — configured in `astro.config.mjs`
- All content pages use catch-all `[...lang]` directory pattern
- Tool pages: `src/pages/[...lang]/{category}/{tool}.astro`
- Pages must export `getStaticPaths` using `getI18nPaths()` from `src/lib/routing.ts`
- Breadcrumb-safe locale detection via `getLocaleFromPath()` in `src/lib/i18n.ts`

### Tool Registry
Semua 30+ tools didefinisikan di `src/lib/tools.ts` dengan `{ id, title, description, href, category, icon }`. Tipe: `ToolDefinition` (LucideIcon, kategori `pdf`/`image`/`text`/`dev`).

| Kategori | Jumlah | Contoh |
|----------|--------|--------|
| PDF | 12 | Merge, Split, Rotate, Compress, Watermark, Word-to-PDF, dll. |
| Image | 10 | Compress, Resize, Crop, QR, Barcode, OCR, Background Remover, dll. |
| Text | 4 | Word Counter, Case Converter, Lorem Ipsum, Markdown Editor |
| Dev | 8 | JSON Formatter, Base64, UUID, Password Generator, Color Picker, dll. |

**Cara menambah tool baru:** add entry di `ALL_TOOLS` → create `.astro` page → add locale keys → optionally create React component.

### Conventions
- React interactive components use `client:only="react"` (never `client:load` or `client:idle`)
- TypeScript dengan `astro/tsconfigs/strict` — `allowJs: true`, `resolveJsonModule: true`
- CSS via Tailwind v4 utility classes + `@theme` custom fonts (`--font-outfit`, `--font-inter`)
- Prettier: `semi: true`, `singleQuote: true`, `trailingComma: "es5"`, `printWidth: 100`, `prettier-plugin-astro`
- ESLint: `typescript-eslint` recommended + `eslint-plugin-astro` + `eslint-plugin-react` (prop-types off) + `eslint-plugin-react-hooks`
- `vite` overridden to `^6.0.0` in package.json overrides
- `.astro/` (generated types), `dist/`, `node_modules/`, `.vercel/` are gitignored
- **100% client-side** — all processing in browser, zero server uploads

### Testing
- Vitest with jsdom environment, globals enabled
- Test files: `src/**/*.{test,spec}.{js,ts,jsx,tsx}`
- DOM APIs available (jsdom); mock `document`/`window` as needed
- Currently 1 test file: `src/lib/utils.test.ts`
- No integration/E2E test suite

### Verification Pipeline (CI order)
```bash
npx astro check    # types + Astro integrity (runs first)
npm test           # vitest run (jsdom, globals)
npm run build      # fails if check or test fails
npm run lint       # eslint . (separate, not in CI)
npm run format     # prettier --write . (no CI gate)
```

---

## 🧭 INDEKS KNOWLEDGE ITEMS

| ID | Kategori | Judul |
|----|----------|-------|
| K-01 | Arsitektur | 3-Tier Agent Architecture |
| K-02 | Fondasi | Clean Code & Industry Standards |
| K-03 | Workflow | Build from Scratch — 4-Phase Protocol |
| K-04 | Workflow | Maintenance & Evolution Protocol |
| K-05 | Keamanan | Security & Anti-Regression Rules |
| K-06 | Keamanan | Lock Critical Core Logic |
| K-07 | Proses | Self-Correction & Troubleshooting Protocol |
| K-08 | Proses | Context-First Reading Mandate |
| K-09 | Output | Code Output Standards |
| K-10 | Output | Response Format Contract |

---

## K-01 · 3-Tier Agent Architecture

Setiap pekerjaan coding dikategorikan ke dalam salah satu dari tiga tier. Agent **wajib** mengidentifikasi tier sebelum mengeksekusi.

```
┌─────────────────────────────────────────────────────┐
│  TIER 1 — THE BLUEPRINT (Arsitektur & Perencanaan)  │
│  Non-deterministik. Output: dokumen, diagram,       │
│  struktur folder. DILARANG menulis logika bisnis.   │
├─────────────────────────────────────────────────────┤
│  TIER 2 — THE BRAIN (Konfigurasi & Integrasi)       │
│  Semi-deterministik. Output: config files,          │
│  schema DB, service layer, wiring antar komponen.   │
├─────────────────────────────────────────────────────┤
│  TIER 3 — THE BODY (Implementasi Logika Bisnis)     │
│  Deterministik penuh. Output: kode produksi yang    │
│  bisa langsung dijalankan. WAJIB bebas dari bug.    │
└─────────────────────────────────────────────────────┘
```

**Aturan Tier Transition:**
- Jangan loncat dari Tier 1 ke Tier 3 tanpa persetujuan user di Tier 2.
- Jika user minta Tier 3, agent harus memastikan Tier 1 & 2 sudah selesai atau diasumsikan secara eksplisit.

---

## K-02 · Clean Code & Industry Standards

### Penamaan (Naming Conventions)
```
Variables & Functions : camelCase      → getUserById, cartItems
Classes & Interfaces  : PascalCase     → UserService, IProductRepo
Constants             : SCREAMING_SNAKE→ MAX_RETRY_COUNT, API_TIMEOUT
Files (komponen)      : PascalCase     → ProductTable.tsx
Files (utils/hooks)   : kebab-case     → use-debounce.ts, format-date.ts
Database columns      : snake_case     → created_at, product_name
```

### Prinsip Wajib
1. **Single Responsibility** — Satu fungsi/kelas hanya melakukan satu hal.
2. **DRY (Don't Repeat Yourself)** — Ekstrak logika duplikat ke utility/helper.
3. **YAGNI (You Aren't Gonna Need It)** — Jangan buat abstraksi yang belum dibutuhkan.
4. **Fail Fast** — Validasi input di awal fungsi (guard clauses), bukan di akhir.
5. **No Magic Numbers** — Semua angka/string literal harus menjadi named constant.

### TypeScript (Project ini menggunakan TypeScript strict)
```typescript
// ✅ WAJIB — Definisikan interface/type secara eksplisit
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
}

// ❌ DILARANG — any tanpa alasan yang sah
function process(data: any): any { ... }

// ✅ BOLEH — unknown + type guard jika tipe memang tidak diketahui
function process(data: unknown): Product {
  if (!isProduct(data)) throw new TypeError('Invalid product shape');
  return data;
}
```

---

## K-03 · Build from Scratch — 4-Phase Protocol

### FASE 1 · Blueprint (Tier 1 & 2)

**Trigger:** User meminta membangun aplikasi baru / tool baru dari nol.

**Checklist wajib sebelum output:**
- [ ] Tentukan tech stack secara eksplisit
- [ ] Buat struktur direktori sesuai pola lumea-app
- [ ] Definisikan file konfigurasi awal
- [ ] Identifikasi dependensi utama beserta versinya
- [ ] **STOP** — Minta persetujuan user sebelum lanjut ke Fase 2

**Template Tool Baru (ikuti pola yang sudah ada):**
```
1. Tambah entry di src/lib/tools.ts  → ToolDefinition di ALL_TOOLS
2. Buat halaman di src/pages/[...lang]/{category}/{tool}.astro
   → Export getStaticPaths = getI18nPaths
   → Gunakan ToolLayout dengan client:only="react"
3. Tambah locale keys di src/locales/{en,id,es}.json
   → tool.<id>.title, tool.<id>.desc
4. Opsional: Buat React component di src/components/tools/<Tool>.tsx
```

### FASE 2 · Frontend Component Development (Tier 3)

**Trigger:** Blueprint sudah disetujui, mulai implementasi UI.

**Aturan Komponen — React (Dumb + Smart):**

```typescript
// ✅ Dumb Component (Presentational)
interface DropzoneProps {
  onDrop: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  isLoading?: boolean;
}

export function Dropzone({ onDrop, accept, maxSize, isLoading }: DropzoneProps) {
  if (isLoading) return <LoadingSpinner />;
  // ...
}

// ✅ Smart Component (Container) — tahu tentang state & logic
export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [compressing, setCompressing] = useState(false);

  const handleCompress = async () => {
    setCompressing(true);
    try {
      const result = await imageCompression(file!, { maxSizeMB: 1 });
      // ...
    } finally {
      setCompressing(false);
    }
  };

  if (!file) return <Dropzone onDrop={setFile} />;
  if (compressing) return <LoadingSpinner />;
  return <PreviewPanel file={file} onCompress={handleCompress} />;
}
```

**Tiga State Wajib: Loading, Error, Empty (+ Data sukses)**

### FASE 3 · Backend API — TIDAK BERLAKU
Lumea adalah **100% client-side**. Tidak ada backend API. Semua pemrosesan terjadi di browser menggunakan WebAssembly / JavaScript murni. Gunakan `useEffect` + Web Workers untuk operasi berat.

### FASE 4 · Integration (Tier 2 + 3)

**Aturan Integrasi Antar-Komponen:**
```typescript
// ✅ Custom Hook — Kelola async state untuk tool
export function usePdfProcessor() {
  const [state, setState] = useState<ProcessState>({ status: 'idle' });

  const process = useCallback(async (file: File) => {
    setState({ status: 'loading' });
    try {
      const result = await processPdfInWorker(file);
      setState({ status: 'success', data: result });
    } catch (error) {
      setState({ status: 'error', error });
    }
  }, []);

  return { state, process };
}
```

**Regression Check Checklist Pasca-Integrasi:**
- [ ] Semua tool merender dengan benar di 3 locale
- [ ] Loading state muncul saat processing (file besar)
- [ ] Error state muncul saat file invalid
- [ ] Empty state muncul sebelum file diupload
- [ ] Console browser bebas dari error/warning
- [ ] Build + Lint + Test lulus

---

## K-04 · Maintenance & Evolution Protocol

### Bug Fixing Protocol

**Urutan Wajib — JANGAN DILEWATI:**
```
1. DIAGNOSA   → Baca log error. Identifikasi file & baris yang bermasalah.
2. ANALISIS   → Jelaskan Root Cause kepada user dalam 2-3 kalimat.
3. KONFIRMASI → Tunggu persetujuan user atas analisis.
4. EKSEKUSI   → Terapkan Surgical Modification (lihat K-05).
5. VALIDASI   → Berikan langkah verifikasi manual kepada user.
```

**Root Cause Analysis Template:**
```
🔴 GEJALA    : [Apa yang user lihat]
🔍 LOKASI    : [File:baris yang relevan]
💡 PENYEBAB  : [Mengapa ini terjadi secara teknis]
🔧 SOLUSI    : [Perubahan minimal yang diperlukan]
⚠️  RISIKO    : [Efek samping potensial jika ada]
```

### Feature Addition Protocol

**Urutan Wajib:**
```
1. READ      → Baca seluruh file yang akan dimodifikasi + dependensinya
2. MAP       → Identifikasi titik eksak di mana kode baru akan disisipkan
3. LOCK      → Tandai blok kode yang TIDAK boleh diubah (K-06)
4. INSERT    → Sisipkan kode baru secara presisi
5. VALIDATE  → Jalankan astro check, test, build
```

### Refactoring Protocol

**Kontrak Refactoring — Harus dipenuhi semua:**
- ✅ Behavior/output sistem identik 100% sebelum dan sesudah
- ✅ Semua test yang ada masih lulus
- ✅ Tidak ada komentar developer yang dihapus
- ✅ Tidak ada `@ts-expect-error`, `eslint-disable`, atau `TODO` yang dihapus
- ✅ Variabel "redundan" hanya dihapus setelah grep/search global membuktikannya tidak terpakai
- ✅ Tampilkan diff sebelum/sesudah untuk setiap file yang diubah

### Code Review & Security Audit Protocol

**Checklist Keamanan:**
```
□ XSS               → Semua output ke HTML di-escape / di-sanitasi (dompurify)?
□ Client Injection  → Input user dibersihkan sebelum diproses?
□ File Validation   → Tipe & ukuran file divalidasi sebelum diproses?
□ Secrets           → Tidak ada API key/password yang hardcoded?
□ Dependency        → Ada library dengan known CVE? (cek npm audit)
□ Logging           → Tidak ada data sensitif yang masuk ke log/console?
□ Client Storage    → Data sensitif tidak disimpan di localStorage sembarangan?
□ iframe Protection → Apakah tool aman dari clickjacking?
```

**Output Audit Format:**
```markdown
## Security Audit Report — [nama file] — [tanggal]

### CRITICAL (Harus diperbaiki sebelum deploy)
- [ ] VULN-001: [Deskripsi] @ [file:baris]

### HIGH (Diperbaiki dalam sprint ini)
- [ ] VULN-002: [Deskripsi] @ [file:baris]

### MEDIUM / LOW (Masuk backlog)
- [ ] VULN-003: [Deskripsi] @ [file:baris]

### INFORMATIONAL (Best practice suggestion)
- INFO-001: [Saran] @ [file:baris]
```

### Dependency Upgrade Protocol

```
1. AUDIT   → Analisis package.json
2. PLAN    → Buat tabel: Package | Versi Lama | Versi Baru | Breaking Changes
3. STAGE   → STOP. Presentasikan plan ke user.
4. CONFIRM → Tunggu instruksi "Lanjutkan" eksplisit dari user.
5. EXECUTE → Jalankan update per batch (minor dulu, lalu major).
6. TEST    → Jalankan `npm run dev`, `npm test`, `npx astro check`
```

**Format Plan Mode:**
```
📦 DEPENDENCY UPGRADE PLAN
═══════════════════════════════════════════════════
Package        │ Sekarang  │ Target    │ Breaking?
───────────────┼───────────┼───────────┼──────────
astro          │ 6.3.1     │ 7.0.0     │ YES — ...
tailwindcss    │ 4.3.0     │ 4.4.0     │ NO
═══════════════════════════════════════════════════
⚠️  Estimasi effort: [N] jam
```

---

## K-05 · Security & Anti-Regression Rules

### Anti-Deletion Protocol (WAJIB)

Agent **DILARANG KERAS** menghapus kode berikut tanpa instruksi eksplisit dari user:

```
🔒 PROTECTED — TIDAK BOLEH DIHAPUS/DIMODIFIKASI TANPA IZIN:
  • Astro config (astro.config.mjs) — i18n, adapter, integrations
  • ESLint config (eslint.config.mjs)
  • Prettier config (.prettierrc)
  • TypeScript config (tsconfig.json)
  • Semua validasi input & sanitasi (dompurify)
  • Error handling & error boundary components
  • Environment variable references (.env)
  • Komentar yang menjelaskan "mengapa" (bukan "apa")
  • @ts-expect-error dengan komentar penjelasan
  • eslint-disable dengan komentar penjelasan
  • Content collection schema (content.config.ts)
  • Tool registry structure & type definitions (src/lib/tools.ts)
  • i18n routing logic (src/lib/routing.ts, src/lib/i18n.ts)
```

### Phantom Cleanup — DILARANG

Phantom Cleanup = menghapus/mengubah kode yang *terlihat* tidak relevan tapi sebenarnya penting.

```typescript
// ❌ PHANTOM CLEANUP — Jangan hapus ini tanpa investigasi
const _unusedImport = require('./legacy-init'); // <-- Mungkin ada side-effect!
const DEBUG_MODE = false; // <-- Mungkin dipakai di tempat lain via grep

// ✅ Jika ragu, lakukan dulu:
// grep -r "DEBUG_MODE" src/
// Hanya hapus jika hasilnya 0 baris selain definisinya
```

---

## K-06 · Lock Critical Core Logic

Sebelum menyentuh file, agent harus mengidentifikasi dan **mengunci** blok-blok berikut:

```
✅ CARA MENANDAI BLOK YANG DIKUNCI:
// ==================== LOCKED: [Nama Blok] ====================
// ⚠️  JANGAN MODIFIKASI tanpa review eksplisit
// ... kode ...
// ==================== END LOCKED =============================
```

**Blok yang selalu dikunci secara default di proyek ini:**
- PDF processing algorithms (pdf-lib manipulation)
- Image processing algorithms (canvas/tensorflow)
- File validation & sanitization logic
- i18n translation resolution logic
- Tool registry (ALL_TOOLS array)
- Routing logic (getI18nPaths, getI18nContentPaths)
- Astro config (astro.config.mjs)
- Content collection config (content.config.ts)

---

## K-07 · Self-Correction & Troubleshooting Protocol

Ketika agent menghasilkan output yang salah atau menghadapi error, ikuti protokol ini:

```
LANGKAH 1 — STOP. Jangan menghasilkan lebih banyak kode yang salah.
LANGKAH 2 — AKUI kesalahan secara eksplisit kepada user.
LANGKAH 3 — DIAGNOSA: Apa yang salah dan mengapa?
LANGKAH 4 — PLAN: Apa pendekatan perbaikan yang benar?
LANGKAH 5 — KONFIRMASI: Minta izin user jika perbaikan melibatkan banyak file.
LANGKAH 6 — EKSEKUSI: Terapkan perbaikan secara Surgical (K-05).
```

**Error Classification:**
```
TIER-1 ERROR : Salah arsitektur/desain → Diskusikan ulang dengan user
TIER-2 ERROR : Salah konfigurasi/integrasi → Perbaiki config, jangan logika bisnis
TIER-3 ERROR : Bug dalam logika bisnis → Surgical fix pada fungsi spesifik
```

---

## K-08 · Context-First Reading Mandate

**Sebelum** menulis atau memodifikasi kode apapun, agent **WAJIB**:

```
CHECKLIST PRA-CODING:
□ Baca seluruh file yang akan dimodifikasi (bukan hanya seksi yang relevan)
□ Baca file yang diimpor oleh file tersebut (satu level)
□ Cek apakah ada test file yang meng-cover kode yang akan diubah
□ Identifikasi semua caller/consumer dari fungsi yang akan diubah
□ Pahami kontrak (interface/type) yang sudah ada
```

**Jika file terlalu besar (>500 baris):**
```
1. Baca bagian imports & exports dulu (gambaran dependensi)
2. Baca fungsi/kelas yang paling relevan
3. Deklarasikan asumsi yang dibuat kepada user secara eksplisit
```

---

## K-09 · Code Output Standards

### Format Output Kode

Agent **WAJIB** menyertakan informasi ini di setiap blok kode:

````markdown
**File:** `src/components/tools/ImageCompressor.tsx`
**Action:** CREATE | MODIFY | DELETE
**Affects:** ImageCompressor page, locale keys en/id/es.json

```typescript
// kode di sini
```

**Perubahan dari versi sebelumnya:**
- Baris 45: Tambah null check sebelum akses `file.size`
- Baris 67: Ekstrak kalkulasi ukuran ke helper `formatFileSize()`
````

### Surgical Modification Format (Diff Style)

Untuk modifikasi pada file yang sudah ada, gunakan format diff:

```diff
// File: src/components/tools/ImageResizer.tsx

  const handleResize = async () => {
-   const canvas = document.createElement('canvas');
+   const canvas = document.createElement('canvas');
+   if (!imageRef.current) return; // FIX: guard clause untuk null ref

    const ctx = canvas.getContext('2d');
+   if (!ctx) throw new Error('Canvas context not available');
```

---

## K-10 · Response Format Contract

Agent **WAJIB** mengikuti format respons berikut berdasarkan tipe permintaan:

### Untuk Analisis/Review (Read-Only)
```
1. RINGKASAN    → Apa yang ditemukan (3-5 kalimat)
2. TEMUAN       → List berformat dengan severity
3. REKOMENDASI  → Langkah selanjutnya yang disarankan
4. PERTANYAAN   → Jika ada ambiguitas, tanyakan SATU pertanyaan saja
```

### Untuk Implementasi (Write)
```
1. KONFIRMASI PEMAHAMAN → Ulangi apa yang akan dibuat/diubah
2. ASUMSI               → Daftar asumsi yang dibuat secara eksplisit
3. KODE                 → Output dengan format K-09
4. INSTRUKSI PENGGUNAAN → Cara mengintegrasikan kode ini
5. REGRESSION CHECK     → 3-5 langkah verifikasi manual
```

### Checkpoint Wajib (STOP & ASK)
Agent wajib berhenti dan meminta konfirmasi user ketika:
- Akan menghapus lebih dari 10 baris kode
- Akan mengubah interface/type yang dipakai di banyak tempat
- Akan mengubah registry tool (ALL_TOOLS structure)
- Akan memodifikasi file konfigurasi (astro, eslint, prettier, tsconfig)
- Tidak yakin dengan requirement (ambiguitas tinggi)
- Akan membuat perubahan yang memengaruhi lebih dari 3 file

---

## 📋 QUICK REFERENCE — Perintah Cepat untuk User

| Perintah | Efek |
|----------|------|
| `@phase1` | Mulai Fase 1: Blueprint |
| `@phase2 [tool]` | Mulai Fase 2: Buat komponen UI untuk [tool] |
| `@phase4 [tool]` | Mulai Fase 4: Integrasi tool ke routing + locale |
| `@fix [gejala]` | Bug fix protocol |
| `@add [fitur] to [file]` | Feature addition protocol |
| `@refactor [file] for [tujuan]` | Refactoring protocol |
| `@audit [file/folder]` | Security audit |
| `@upgrade [package]` | Dependency upgrade plan |
| `@lock [blok kode]` | Tandai blok sebagai kritial, jangan diubah |

---

*Dokumen ini adalah living document. Update versi setiap kali ada perubahan signifikan pada standar proyek.*
*Last updated: 2026 | Format: Markdown*
