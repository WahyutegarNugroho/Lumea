# Lumea App — The Ultimate Client-Side Web Utilities
Astro v6 | React 19 | Tailwind CSS v4 | 100% Client-Side | Vercel Ready | MIT License

## Nama Project
Lumea App — Platform Utilitas Web Berbasis Klien (Client-Side)

## Deskripsi Singkat
Lumea App menjembatani kebutuhan alat utilitas digital sehari-hari dengan privasi dan keamanan tingkat tinggi. Platform ini menyediakan lebih dari 30 alat untuk manipulasi PDF, pemrosesan gambar, utilitas pengembang (developer tools), hingga pemformatan teks. Seluruh proses komputasi terjadi 100% di browser pengguna tanpa melibatkan unggahan file ke server eksternal, menjadikannya platform yang aman, rahasia, cepat, dan modern.

## Problem yang Diselesaikan
- **Privasi & Keamanan Data** — Banyak pengguna enggan menggunakan alat online untuk mengedit dokumen rahasia (seperti laporan keuangan atau kartu identitas) karena risiko file tersebut disimpan atau disalahgunakan di server pihak ketiga.
- **Ketergantungan Server & Latensi** — Alat tradisional membutuhkan waktu lama untuk proses _upload_ dan _download_, terutama untuk file berukuran besar.
- **Paywalls & Batasan Penggunaan** — Banyak layanan membatasi jumlah konversi harian atau ukuran maksimal file secara sepihak dan memaksa pengguna untuk membayar langganan.
- **UI/UX Usang** — Banyak situs penyedia alat gratis dipenuhi iklan yang mengganggu dan memiliki antarmuka yang membingungkan.

Lumea App menyelesaikan semua ini dengan mengubah browser pengguna menjadi mesin pemroses utama (Zero-Uploads), 100% gratis tanpa batasan server, serta dirancang dengan desain premium bergaya modern.

## Fitur Utama
**1. Privasi Mutlak (Zero-Server Architecture)**
Semua operasi, mulai dari pemotongan PDF, kompresi gambar, hingga pemindaian AI (OCR), diproses secara langsung oleh CPU/GPU perangkat keras Anda. Sama sekali tidak ada dokumen yang singgah di server jarak jauh.

**2. 30+ Alat Premium Terintegrasi**
- **PDF Tools:** Merge, Split, Rotate, Compress, Watermark, PDF to Word, PDF to Excel, PDF to JPG, dll.
- **Image Tools:** Background Remover AI, Image Compressor, Resizer, SVG to PNG, Cropper, Barcode & QR Generator.
- **Dev Tools:** JSON Formatter, Base64 Encoder/Decoder, Code Beautifier, Password & UUID Generator.
- **Text Tools:** Diff Checker, Markdown Editor interaktif, Word Counter, Lorem Ipsum, dll.

**3. Dukungan Multi-Bahasa (i18n)**
Sistem _routing_ pintar secara bawaan mendukung Bahasa Inggris (`en`), Indonesia (`id`), dan Spanyol (`es`), dirancang khusus untuk lokalisasi SEO global.

**4. Dark Mode & Favorite Tools Terintegrasi**
Tema _Dark Mode_ sejati dan adaptif untuk setiap halaman. Terdapat juga sistem "Favorites" yang memungkinkan pengguna menyematkan alat favorit ke daftar teratas Beranda secara instan.

**5. Progressive Web App (PWA)**
Lumea dapat diinstal ke layar Desktop (Windows/Mac) maupun perangkat Mobile (Android/iOS) layaknya aplikasi mandiri (Native App).

## Kelebihan & Kekurangan
**Kelebihan**
- **Keamanan Tanpa Kompromi:** Mustahil terjadi kebocoran data karena pemrosesan berjalan di _sandbox_ peramban pengguna.
- **Kecepatan Instan:** Menghilangkan batasan ping (latensi) internet untuk transfer file besar.
- **UI/UX Memukau:** Dirancang teliti dengan Tailwind v4 menggunakan mikro-animasi elegan, Glassmorphism, dan palet warna hidup (Gaya Apple/Vercel).
- **Skor Performa Sempurna:** Arsitektur Astro menghasilkan skor Lighthouse nyaris 100/100, ditambah fitur _View Transitions_ untuk perpindahan halaman (navigasi SPA) tanpa layar berkedip.

**Kekurangan**
- **Spesifikasi Perangkat Sangat Berpengaruh:** Karena diproses murni oleh perangkat keras Anda, fitur berat (seperti _AI Background Removal_ atau konversi PDF raksasa) bisa saja melambat di perangkat _smartphone_ tua atau PC spesifikasi rendah.
- **Browser Modern Wajib:** Memerlukan browser yang mendukung arsitektur *WebAssembly* dan JavaScript versi terbaru.

## Tech Stack
| Teknologi | Peran | Alasan |
|-----------|-------|--------|
| **Astro v6** | Framework Web | Memberikan pondasi situs secepat kilat dengan konsep Island Architecture. Menghapus JavaScript tak berguna dan memprioritaskan performa awal. |
| **React 19** | Frontend Engine | Menyediakan arsitektur komponen UI yang sangat stabil dan mutakhir untuk modul alat yang interaktif. Di-eksekusi secara `client:only`. |
| **Tailwind CSS v4** | Styling | *Utility-first* CSS generasi terbaru yang tidak membutuhkan konfigurasi rumit. Sangat ampuh untuk manajemen *Dark Mode* adaptif tanpa file CSS jumbo. |
| **Vite** | Bundler | Disematkan bawaan dengan Astro untuk mendukung pergantian modul panas (HMR) secepat kilat dalam fase _development_. |
| **Vitest & JSDOM** | Testing Framework | Pengecekan unit _client-side_ yang terintegrasi secara _native_ dengan Vite, mengamankan keandalan _build_ ke produksi. |

## Cara Install / Run
**Prasyarat**
- Node.js v22.12.0 atau lebih tinggi
- npm, pnpm, atau yarn

**Langkah-Langkah**
```bash
# 1. Clone repositori
git clone https://github.com/WahyutegarNugroho/Lumea.git
cd Lumea

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev
# Buka http://localhost:4321 di browser Anda

# 4. Verifikasi Tipe (CI)
npx astro check

# 5. Build untuk Production
npm run build
```

## Lisensi
MIT License — © 2026 whtsn dev.
