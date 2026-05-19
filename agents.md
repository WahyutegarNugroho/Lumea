# AI Agent Rules of Engagement & Code Preservation Protocol (`agents.md`)

> **Compatibility:** Universally applicable across any tech stack (Web, Mobile, Backend, Scripts). 
> **Target AI Behavior:** Optimized for Gemini Flash, Claude, and Agentic IDEs (Antigravity, Cursor, Roo Code).

Dokumen ini adalah undang-undang tertinggi bagi AI Agent. Anda WAJIB mematuhi seluruh arsitektur kerja dan batasan ketat (guardrails) di bawah ini tanpa pengecualian. Pelanggaran terhadap aturan ini dapat merusak integritas sistem produksi.

---

## 1. The 3-Tier Architecture (Universal Workflow)

Untuk mencegah penumpukan kesalahan (*compounding errors*) dalam tugas multi-tahap, Anda wajib memisahkan proses berpikir, perencanaan, dan eksekusi ke dalam 3 lapisan berikut:

* **Tier 1: The Blueprint (Directives & PRD)**
  Dokumen spesifikasi, aturan, atau instruksi manusia (seperti `prd.md`, folder `directives/`, atau file `agents.md` ini). Ini adalah panduan absolut yang menentukan hasil akhir yang diharapkan.
* **Tier 2: The Brain (Orchestration & Planning)**
  Peran utama Anda sebagai AI. Anda wajib membaca Blueprint, menganalisis file yang ada, menggunakan **Plan Mode**, dan merancang logika perubahan sebelum menyentuh kode.
* **Tier 3: The Muscle (The Target Codebase & Tools)**
  Kode sumber aplikasi, API, skrip otomasi, atau database. Ini adalah wilayah deterministik. Tugas Anda adalah memastikan wilayah ini tetap bersih, andal, cepat, dan aman.

---

## 2. Aturan Ketat Pemeliharaan Kode (Anti-Deletion Protocol)

Bagian ini adalah aturan paling kritis saat Anda melakukan perbaikan bug, optimalisasi, penambahan fitur, atau refactoring pada kode yang sudah berjalan.

### 🟢 YANG WAJIB DILAKUKAN (DO)
1. **Surgical Modifications (Perubahan Bedah):** Lakukan perubahan kode secara minimal, presisi, dan hanya pada baris atau fungsi yang ditargetkan. Biarkan 90% sisa kode lainnya dalam file tersebut tetap utuh 100%.
2. **Context-First Reading:** Baca dan pahami seluruh isi file serta dependensinya sebelum melakukan modifikasi. Cari tahu apakah kode yang akan Anda ubah memiliki ketergantungan dengan fungsi di bagian lain.
3. **Lock Critical Core Logic:** Kunci dan amankan logika kritis yang sudah berjalan dengan baik. Anda DILARANG mengubah atau menghapus fungsi yang mengatur:
   * **Sistem Keamanan:** Autentikasi, otorisasi, pengecekan token, sesi, dan enkripsi.
   * **Hak Akses Pengguna (RBAC):** Pengecekan tingkatan pengguna (Admin, Petugas, Customer, dll).
   * **Aliran Data Dasar:** Fungsi pengalihan (*redirect*), *middleware*, penanganan *streaming*, dan *loading state*.
4. **Verifikasi Output Diff:** Sebelum menyajikan atau menerapkan kode, periksa panel *Diff* (Merah/Hijau). Pastikan baris yang memerah (dihapus) memang merupakan kode rusak atau usang, bukan kode fungsional.

### 🔴 YANG DILARANG KERAS (DON'T)
1. **Dilarang Melakukan Phantom Cleanup (Pembersihan Siluman):** JANGAN PERNAH menghapus, menyederhanakan, merapikan, atau memformat ulang (*auto-format*) kode di luar lingkup tugas utama dengan alasan "efisiensi" atau "perapian", kecuali diminta secara tertulis oleh pengguna.
2. **Jangan Menulis Ulang Satu File Penuh (Full Rewrite):** Jika perbaikan hanya terjadi pada 5-10 baris kode, jangan menulis ulang 200 baris kode lainnya di file tersebut. Tindakan ini berisiko menghilangkan logika tersembunyi (*edge cases*).
3. **Jangan Berasumsi Kode Redundan:** Jika Anda melihat ada variabel, fungsi, atau potongan logika yang tampaknya tidak aktif, JANGAN dihapus. Kode tersebut mungkin digunakan untuk penanganan kasus khusus, skrip pengujian (*testing*), atau diakses oleh sistem lain secara tidak langsung.
4. **Jangan Menghapus Komentar Developer:** Dilarang menghapus komentar dokumentasi, anotasi penting, atau catatan penolak pengecekan kompiler (seperti `// @ts-ignore`, `# noqa`, atau sejenisnya).

---

## 3. Protokol Koreksi Mandiri & Troubleshooting (Auto-Correction Protocol)

* **Root Cause Analysis (Analisis Akar Masalah):** Saat menghadapi *error*, kegagalan kompilasi, atau *crash* sistem, Anda wajib membaca *log error* atau *stack trace* secara menyeluruh terlebih dahulu. Identifikasi dan jelaskan akar masalahnya (*root cause*) secara singkat kepada pengguna sebelum menyusun rencana perbaikan (Plan Mode).
* **Anti-Trial-and-Error:** Dilarang keras melakukan modifikasi spekulatif atau mengubah kode secara membabi buta hanya untuk melihat apakah kesalahan tersebut hilang secara tidak sengaja. Setiap perubahan harus didasari alasan logis yang kuat berdasarkan analisis kode.
* **Regression Check:** Pastikan perbaikan yang Anda lakukan untuk menyelesaikan masalah "A" tidak menimbulkan masalah baru "B" di file yang sama atau merusak komponen sistem yang saling bergantung (*regression safe*).
* **Dokumentasikan Perubahan:** Jika Anda menemukan batasan sistem atau *bug* bawaan pada pustaka pihak ketiga, perbarui dokumen panduan (*Blueprint/Directives*) agar kesalahan serupa tidak terulang di masa depan.

---

## 4. Protokol Output & Komunikasi

* **Tampilkan Potongan Kode (Code Snippets):** Berikan hasil kerja dalam bentuk potongan fungsi yang berubah atau format *diff* sebelum vs sesudah. Jangan menimbun ruang obrolan dengan isi satu file penuh yang dominan berisi kode yang tidak berubah.
* **Berhenti dan Bertanya Jika Ambigu:** Jika instruksi pengguna tidak jelas, tidak lengkap, atau berpotensi melanggar aturan keamanan dan merusak struktur yang sudah ada di `agents.md` ini, Anda **WAJIB berhenti** dan meminta klarifikasi sebelum menulis satu baris kode pun.
