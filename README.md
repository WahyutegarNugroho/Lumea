# Lumea App — Platform Utilitas Web 100% Client-Side

![Astro](https://img.shields.io/badge/Astro-6-FF5D01?logo=astro&logoColor=white&style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white&style=flat-square)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white&style=flat-square)
![PWA](https://img.shields.io/badge/PWA-✓-5A0FC8?logo=pwa&logoColor=white&style=flat-square)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white&style=flat-square)
![License](https://img.shields.io/badge/License-MIT-F0DB4F?style=flat-square)

---

## Nama Project

**Lumea App** — "Illuminating Your Path, to Seamless Productivity"
Platform all-in-one yang menyediakan 34 alat utilitas digital (PDF, gambar, teks, developer) yang berjalan 100% di browser, tanpa server backend, tanpa upload file, dan gratis selamanya.

---

## Deskripsi Singkat

Lumea App adalah platform web progresif (PWA) yang menghadirkan lebih dari 34 alat produktivitas — mulai dari manipulasi PDF, pemrosesan gambar, OCR, hingga utilitas developer — dengan **privasi mutlak**. Seluruh komputasi terjadi di perangkat pengguna melalui API browser modern dan WebAssembly. Tidak ada file yang dikirim ke server, tidak ada batasan ukuran, tidak ada akun, dan tidak ada iklan. Didukung sistem i18n tiga bahasa (Indonesia, Inggris, Spanyol), mode gelap, serta sistem favorit dan alat terkini yang tersimpan di peramban.

---

## Problem yang Diselesaikan

1. **Privasi & Keamanan Data** — Alat online konvensional menyimpan file pengguna di server pihak ketiga, berisiko bocor atau disalahgunakan. Lumea memproses semuanya di sandbox browser lokal (zero-trust architecture).

2. **Ketergantungan Server & Latensi** — Upload/download file besar memakan waktu dan bandwidth. Dengan pemrosesan lokal, tidak ada latensi jaringan; hasil instan bahkan untuk file berukuran besar.

3. **Paywalls, Iklan & Batasan Kuantitas** — Layanan komersial membatasi jumlah konversi harian, ukuran file, atau memaksa langganan. Lumea 100% gratis tanpa batasan.

4. **UI/UX yang Membingungkan** — Banyak situs alat gratisan dipenuhi iklan mengganggu dan navigasi ruwet. Lumea hadir dengan antarmuka premium, modern, dan responsif.

---

## Fitur Utama

### 🧾 PDF Tools (12 alat)
| Alat | Deskripsi |
|------|-----------|
| **Organize PDF** | Susun ulang & hapus halaman PDF via drag-and-drop |
| **Merge PDF** | Gabungkan beberapa PDF jadi satu |
| **Split PDF** | Ekstrak halaman tertentu dari PDF |
| **Rotate PDF** | Rotasi halaman PDF secara permanen |
| **Watermark PDF** | Tambahkan teks watermark ke PDF |
| **Compress PDF** | Perkecil ukuran file PDF |
| **JPG to PDF** | Konversi gambar JPG/PNG ke PDF |
| **PDF to JPG** | Ekstrak halaman PDF sebagai gambar JPG |
| **Word to PDF** ⚡ | Konversi DOCX ke PDF |
| **Excel to PDF** ⚡ | Konversi XLSX ke PDF |
| **PDF to Word** ⚡ | Konversi PDF ke DOCX |
| **PDF to Excel** ⚡ | Konversi PDF ke XLSX |

> ⚡ = Menggunakan mesin iLovePDF untuk kualitas konversi optimal.

### 🖼️ Image Tools (10 alat)
| Alat | Deskripsi |
|------|-----------|
| **Image Compressor** | Kompres ukuran gambar tanpa aplikasi desktop |
| **Background Remover** | Hapus latar belakang otomatis dengan AI (MediaPipe + TensorFlow.js) |
| **SVG Vectorizer** | Ubah gambar raster (JPG/PNG) ke SVG vektor |
| **Image Resizer** | Ubah dimensi gambar secara presisi |
| **Image Cropper** | Potong & rotasi gambar interaktif |
| **Format Converter** | Konversi antar format JPG, PNG, WebP |
| **SVG to PNG** | Konversi file SVG ke PNG |
| **QR Generator** | Buat kode QR kustom dengan logo & warna |
| **Barcode Generator** | Buat barcode (Code 128, EAN-13, UPC-A, dll) |
| **Image to Text (OCR)** | Ekstrak teks dari gambar via Tesseract.js |

### 📝 Text Tools (4 alat)
| Alat | Deskripsi |
|------|-----------|
| **Word Counter** | Hitung kata, karakter, kalimat & paragraf real-time |
| **Case Converter** | Ubah kapitalisasi teks (UPPER, lower, Title, dll) |
| **Lorem Ipsum** | Generate teks placeholder dengan berbagai format |
| **Markdown Editor** | Editor Markdown dengan preview real-time & export HTML |

### 💻 Developer Tools (8 alat)
| Alat | Deskripsi |
|------|-----------|
| **JSON Formatter** | Format & minify JSON dengan validasi struktur |
| **Code Formatter** | Beautify HTML, CSS, JS/TS code |
| **Base64 Tool** | Encode/decode string & file ke Base64 |
| **Password Generator** | Generate password acak dengan aturan kustom |
| **URL Tool** | Encode/decode URL dengan aman |
| **UUID Generator** | Generate UUID v4 acak |
| **Diff Checker** | Bandingkan dua teks side-by-side |
| **Color Picker** | Pilih warna & konversi antar format HEX, RGB, HSL |

### Fitur Platform
- **🔒 Zero-Server Architecture** — 100% client-side, tidak ada data dikirim ke server
- **🌐 Multi-Bahasa (i18n)** — Indonesia, Inggris, Spanyol dengan 618 key terjemahan per bahasa
- **🌙 Dark Mode** — Tema gelap/terang adaptif dengan Tailwind v4, tersimpan di localStorage
- **📱 PWA (Progressive Web App)** — Install ke layar utama, service worker dengan cache strategi
- **⭐ Favorites** — Sematkan alat favorit ke beranda, tersimpan di localStorage
- **🕐 Recent Tools** — Riwayat 6 alat terakhir yang digunakan
- **⌨️ Command Palette** — Pencarian cepat semua alat dengan shortcut Ctrl+K
- **📖 Panduan Lengkap** — 102 artikel panduan (34 tool × 3 bahasa) via Astro Content Collections
- **📊 Schema.org SEO** — JSON-LD structured data untuk setiap halaman alat
- **🔍 SEO Sitemap** — Sitemap multi-bahasa dengan hreflang tags

---

## Kelebihan & Kekurangan

### ✅ Kelebihan
- **Privasi tanpa kompromi** — Zero upload, semua proses di sandbox browser
- **100% gratis** — Tanpa batasan jumlah penggunaan, ukuran file, atau fitur premium
- **Kaya fitur** — 34 tools dalam satu platform, tidak perlu install banyak aplikasi
- **Performa tinggi** — Arsitektur Astro Island + Vite HMR + Lighthouse score optimal
- **UI/UX premium** — Desain modern dengan framer-motion, glassmorphism, palet warna Apple/Vercel
- **Aksesibel & inklusif** — 3 bahasa, dark mode, keyboard shortcut, skip-to-content
- **PWA siap pakai** — Bisa diinstall seperti aplikasi native di desktop & mobile
- **SEO-friendly** — Sitemap, JSON-LD, hreflang, meta tags lengkap

### ❌ Kekurangan
- **Bergantung pada spesifikasi perangkat** — Tool berat (AI Background Removal, OCR) bisa lambat di perangkat low-end
- **Browser modern wajib** — Membutuhkan Chromium 90+, Firefox 90+, Safari 15+ yang mendukung WebAssembly & API modern
- **4 alat konversi bergantung pihak ketiga** — Word-to-PDF, Excel-to-PDF, PDF-to-Word, PDF-to-Excel menggunakan mesin iLovePDF (karena kualitas output)
- **Penyimpanan terbatas** — File hanya berada di memori browser; tidak ada history penyimpanan cloud

---

## Tech Stack

### Framework & Bahasa
| Teknologi | Peran | Alasan |
|-----------|-------|--------|
| **Astro v6** | Web Framework | Island Architecture — render statis super cepat, zero JS bawaan, View Transitions SPA |
| **React 19** | Komponen Interaktif | Ekosistem matang, hooks modern, dipakai `client:only` untuk tool interaktif |
| **TypeScript 5.7** | Type Safety | Strict mode, keamanan tipe di seluruh codebase |
| **Vite 6** | Bundler/Dev Server | HMR instan, integrated via Astro, override spesifik |

### UI & Styling
| Teknologi | Peran | Alasan |
|-----------|-------|--------|
| **Tailwind CSS v4** | Utility CSS | Zero-config, dark mode via `@custom-variant`, bundle kecil |
| **Framer Motion** | Animasi | Animasi React deklaratif, gesture, layout animations |
| **Lucide React** | Ikon | 1500+ ikon konsisten, ringan, tree-shakeable |
| **React Hot Toast** | Notifikasi | Toast ringan, accessible, kustomisasi tinggi |
| **clsx + tailwind-merge** | Class Utility | Conditional classes + deduplikasi konflik Tailwind |

### PDF Processing (Client-Side)
| Teknologi | Peran |
|-----------|-------|
| **pdf-lib** | Manipulasi PDF (merge, split, rotate, watermark, kompres) |
| **pdfjs-dist** | Render pratinjau halaman PDF di browser |
| **jspdf + jspdf-autotable** | Generate PDF baru & tabel |

### Image Processing
| Teknologi | Peran |
|-----------|-------|
| **browser-image-compression** | Kompresi gambar tanpa server |
| **imagetracerjs** | Vektorisasi gambar raster ke SVG |
| **html2canvas** | Screenshot DOM ke gambar |
| **@mediapipe/selfie_segmentation** | AI segmentasi latar belakang |
| **@tensorflow/tfjs-core + tfjs-backend-webgl** | Inference engine untuk MediaPipe AI |

### Document & Data
| Teknologi | Peran |
|-----------|-------|
| **mammoth** | Konversi DOCX ke HTML |
| **docx** | Generate file DOCX |
| **xlsx** | Baca/tulis file Excel |

### Text & Markup
| Teknologi | Peran |
|-----------|-------|
| **marked** | Render Markdown ke HTML |
| **dompurify** | Sanitasi HTML (cegah XSS) |

### Barcode & OCR
| Teknologi | Peran |
|-----------|-------|
| **qrcode** | Generate QR code di canvas |
| **bwip-js** | Generate berbagai jenis barcode |
| **tesseract.js** | OCR client-side via WebAssembly |

### Drag & Drop
| Teknologi | Peran |
|-----------|-------|
| **@dnd-kit** (core, modifiers, sortable, utilities) | Drag-and-drop untuk PDF organizer |

### Infrastruktur
| Teknologi | Peran |
|-----------|-------|
| **@astrojs/vercel** | Deployment ke Vercel (serverless) |
| **@astrojs/sitemap** | SEO sitemap multi-bahasa |
| **@fontsource/inter + outfit** | Font self-hosted (tanpa Google Fonts request) |

### Kualitas & Testing
| Teknologi | Peran |
|-----------|-------|
| **Vitest + jsdom** | Unit test client-side, globals enabled |
| **ESLint** (typescript-eslint, eslint-plugin-astro, eslint-plugin-react) | Linting |
| **Prettier** + prettier-plugin-astro | Formatting otomatis |
| **@astrojs/check** | Type-check Astro files |

---

## Cara Install / Run

**Prasyarat**
- Node.js >= 22.12.0
- npm (atau pnpm/yarn)

**Langkah-langkah**
```bash
# 1. Clone repositori
git clone https://github.com/WahyutegarNugroho/Lumea.git
cd Lumea

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev
# Buka http://localhost:4321

# 4. (Opsional) Type-check
npx astro check

# 5. (Opsional) Jalankan test
npm test

# 6. Build untuk production
npm run build

# 7. Preview build
npm run preview
```

**Scripts yang tersedia**
| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Jalankan dev server (localhost:4321) |
| `npm run build` | Build ke `dist/` |
| `npm run preview` | Preview build lokal |
| `npm test` | Jalankan Vitest (unit test) |
| `npm run lint` | ESLint seluruh project |
| `npm run format` | Prettier format semua file |
| `npx astro check` | Type-check Astro |

---

## Lisensi

MIT License — © 2026 whtsn dev.
