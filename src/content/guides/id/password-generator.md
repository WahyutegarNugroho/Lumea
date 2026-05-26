---
title: "Menghasilkan Kata Sandi yang Aman Secara Kriptografis"
description: "Mengapa Math.random() tidak cukup dan bagaimana Lumea memastikan kata sandi Anda benar-benar aman."
category: "dev"
toolId: "password-generator"
---

Dalam dunia keamanan siber, keacakan adalah segalanya. Kata sandi yang terlihat "acak" bagi manusia mungkin mudah ditebak oleh komputer jika sumber keacakannya lemah.

### Masalah dengan Alat Standar
Banyak situs web menggunakan `Math.random()` untuk menghasilkan kata sandi. Ini adalah pembangkit angka acak semu (PRNG) yang tidak dirancang untuk keamanan. Ini dapat diprediksi dalam kondisi tertentu.

### Solusi Lumea
Kami menggunakan metode `crypto.getRandomValues()` dari **Web Crypto API**. Ini adalah sumber keacakan yang kuat secara kriptografis yang disediakan oleh peramban Anda. Teknologi yang sama digunakan untuk tanda tangan digital dan enkripsi.

### Tips untuk Kata Sandi yang Kuat
- **Panjang**: Gunakan setidaknya 16 karakter.
- **Kompleksitas**: Sertakan angka dan simbol.
- **Keunikan**: Jangan pernah menggunakan ulang kata sandi di situs yang berbeda.

Generator kami memungkinkan Anda menyesuaikan semua faktor ini dan memberi Anda string yang aman secara instan, tanpa pernah mengirimkan string tersebut ke server.
