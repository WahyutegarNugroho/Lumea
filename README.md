# Lumea App

## Nama project:
Lumea App

## Deskripsi singkat:
Lumea adalah aplikasi _all-in-one web utility_ yang menyediakan lebih dari 30+ alat (seperti pemroses PDF, editor gambar, pengubah teks, dan alat developer) yang 100% berjalan di sisi klien (browser) tanpa perlu mengunggah data apa pun ke server jarak jauh.

## Problem yang diselesaikan:
Banyak pengguna yang membutuhkan alat untuk mengedit dokumen (misal: PDF, Image, Code) secara cepat namun terhalang oleh privasi. Banyak alat utilitas *online* pihak ketiga mewajibkan pengguna untuk mengunggah (_upload_) dokumen sensitif atau rahasia perusahaan ke server mereka, menimbulkan risiko kebocoran data. Selain itu, banyak dari layanan tersebut yang menerapkan sistem berbayar atau batasan penggunaan (paywalls/limits). Lumea menyelesaikan masalah privasi ini dengan memproses segala hal di komputer pengguna itu sendiri (Client-Side Processing).

## Fitur utama:
- **30+ Premium Tools:** Meliputi penggabungan PDF, kompresi gambar, penghapus background berbasis AI, pembuat QR code, pembentuk Markdown, formatter JSON, dll.
- **Privacy-First Architecture (100% Client-Side):** Tidak ada data atau file yang dikirim ke server jarak jauh. Semua proses enkripsi, manipulasi file, dan kompresi terjadi di browser lokal menggunakan WebAssembly dan API modern.
- **Dukungan Multi-Bahasa (i18n):** Tersedia secara native dalam bahasa Inggris (en), Indonesia (id), dan Spanyol (es).
- **Smart Dark Mode:** Tampilan antar muka mode gelap dan terang yang diatur dengan presisi menggunakan Tailwind CSS v4.
- **Favorite Tools System:** Menyematkan alat yang paling sering digunakan langsung ke beranda dengan data yang disimpan secara lokal (`localStorage`).
- **Progressive Web App (PWA):** Dapat diinstal secara langsung (installable) di desktop maupun perangkat mobile layaknya aplikasi _native_.

## Kelebihan/Kekurangan:
**Kelebihan:**
- Tingkat keamanan dan privasi maksimal karena nihilnya transfer data keluar.
- Sangat cepat dan responsif (Zero Latency Uploads) berkat ketiadaan waktu tunggu unggah/unduh jaringan.
- Gratis dan tidak ada batasan ukuran file yang kaku dari sisi server.
- Desain UI/UX modern, premium, dan sangat hidup dengan menggunakan _Micro-animations_.

**Kekurangan:**
- Performa aplikasi sangat bergantung pada spesifikasi CPU dan RAM perangkat klien (misal: melakukan _Background Removal AI_ atau kompresi file besar bisa jadi lambat di _smartphone_ tua).
- Tidak bisa digunakan di peramban (browser) usang yang tidak mendukung modul JavaScript modern (ESM) atau WebAssembly.

## Tech stack
- **Astro (v6):** Dipilih sebagai pondasi framework berkat kemampuan _View Transitions_-nya yang membuat situs terasa seperti SPA yang sangat cepat, serta kapabilitas integrasi komponen yang fleksibel dan manajemen routing bahasa yang rapi.
- **React (19):** Digunakan untuk mengelola _state_ komponen utilitas interaktif tingkat lanjut yang kompleks di sisi klien.
- **Tailwind CSS (v4):** Memberikan _utility classes_ yang ringan, efisien, dan mendukung variasi tema khusus (_custom variants_ seperti `dark:` via WebMedia) tanpa perlu memuat stylesheet eksternal yang besar.
- **Vitest & JSDOM:** Ekosistem testing modern yang cepat dan sejalan dengan Vite (bundler bawaan Astro) untuk memvalidasi fungsi murni TypeScript.

## Cara install/run:

Pastikan Anda memiliki **Node.js (v22.12.0 atau lebih baru)** terinstal di sistem Anda.

1. **Clone repository & masuk ke direktori proyek:**
   ```bash
   git clone <repository_url>
   cd lumea-app
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan _development server_:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:4321`.

4. **Verifikasi Tipe (Opsional):**
   ```bash
   npx astro check
   ```

5. **Build untuk Produksi:**
   ```bash
   npm run build
   ```
   Hasil _build_ akan tersedia di folder `dist/` atau `.vercel/output/` tergantung adapter yang digunakan.
