# 🌟 Lumea

<p align="center">
  <img src="./public/favicon.svg" alt="Lumea Logo" width="120px" height="120px" />
</p>

<p align="center">
  <strong>Illuminating Your Path to Seamless Productivity</strong>
</p>

<p align="center">
  <a href="https://astro.build"><img src="https://img.shields.io/badge/Astro-v6.3-FF5D01?style=flat-square&logo=astro&logoColor=white" alt="Astro" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-v19.0-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/Vercel-Adapter-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" /></a>
  <img src="https://img.shields.io/badge/Privacy-100%25_Browser--Only-brightgreen?style=flat-square" alt="Privacy First" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT License" />
</p>

<hr />

## 📖 Short Description

**Lumea** (derived from the word for *"Light"*) is a comprehensive, modern, and high-fidelity web utility suite featuring **30+ professional-grade online tools**. Built with **Astro**, **React**, and **Tailwind CSS v4**, Lumea works like a beam of light in the darkness, providing clean, instant, and angelic solutions to your daily file processing, image manipulation, text formatting, and developer utility needs.

Unlike traditional web utilities, **Lumea is 100% client-side**. All computations, parsing, and rendering happen directly within your browser's secure sandbox using state-of-the-art Web APIs, local AI models, and WebAssembly. **Your files never leave your computer.**

---

## 🛡️ The Problems We Solve

### 1. The Death of Data Privacy
Most mainstream utility sites (like PDF mergers, file converters, or image background removers) require you to upload your files to their remote servers. For companies, professionals, and privacy-conscious users, this is a massive compliance and security risk. Your financial reports, personal photos, or legal contracts end up in a third-party cloud, vulnerable to data breaches or unauthorized use in AI training datasets.
*   **Lumea's Solution:** A **Privacy-First Architecture**. Because every tool executes entirely on your device, Lumea has **zero server uploads**. Your data remains 100% private, secure, and compliant.

### 2. Paywalls, Subscriptions, and Limits
Popular utility platforms are notorious for limiting file sizes, daily conversions, or hiding essential features behind aggressive paywalls and mandatory registrations.
*   **Lumea's Solution:** Completely free, open-source, and unlimited. There are no subscriptions, no accounts, and no restrictions on file size or usage count.

### 3. Tool Fragmentation
Having to jump between a dozen different websites to format JSON, merge a PDF, generate a QR code, crop a headshot, and compare text revisions is tedious and breaks workflow focus.
*   **Lumea's Solution:** A centralized, beautiful, unified workspace that puts a vast, categorized toolkit right at your fingertips with a premium, lightning-fast UX.

---

## 🛠️ Main Features

Lumea compiles over 30 powerful utility tools categorized into four distinct workspaces, designed with visually curated dashboards and responsive modern interfaces:

### 📂 1. PDF Tools (Document & Page Management)
Complete suite for manipulating and formatting document structures securely inside your browser:
*   **Merge PDF:** Combine multiple PDF files in any order.
*   **Split PDF:** Extract custom page ranges (e.g. `1-5, 8, 10-12`) into separate documents.
*   **Organize PDF:** Visual 2D Grid Reordering to drag-and-drop pages freely or delete unwanted pages using `@dnd-kit`.
*   **Rotate PDF:** Rotate specific pages or entire files permanently by updating metadata.
*   **Watermark PDF:** Apply fully customizable text watermarks with control over font size, opacity, and rotation.
*   **Compress PDF:** Optimize and reduce PDF file size while maintaining readability.
*   **PDF converters:** Cross-convert between document structures locally:
    *   **JPG to PDF** & **PDF to JPG** (render crisp page screenshots using a 2.0x scale factor).
    *   **Word to PDF** & **PDF to Word** (reconstruction of text structures and formatting).
    *   **Excel to PDF** & **PDF to Excel** (spatial text distribution analysis for spreadsheet table extraction).

### 🖼️ 2. Image Tools (Local Processing & AI)
High-performance visual manipulation without a single network call:
*   **Background Remover:** On-device AI-powered background removal using the **MediaPipe Selfie Segmentation** model running locally on your CPU/GPU.
*   **SVG Vectorizer:** Trace raster images into clean, scale-ready SVG vector paths with adjustable detail presets using `imagetracerjs`.
*   **Image Compressor:** Fast multi-threaded image reduction via Web Workers.
*   **Image Cropper & Resizer:** Pixel-perfect resizing, locks, and crop handle overlays.
*   **Format Converter:** Instant cross-conversion between JPG, PNG, and WebP formats.
*   **SVG to PNG:** Convert vector graphics to high-resolution rasters with custom dimensions.
*   **QR Code & Barcode Generator:** Highly customizable vector outputs with color customization.

### ✍️ 3. Text Tools (Content Cleaners)
Clean, structure, and inspect prose and text copy:
*   **Markdown Editor:** Interactive side-by-side split editor with live Markdown-to-HTML rendering.
*   **Word Counter:** Real-time character (with/without spaces), word, sentence, and paragraph counts alongside calculated reading times.
*   **Case Converter:** Toggle text instantly between UPPERCASE, lowercase, Title Case, Sentence Case, and Capitalization.
*   **Lorem Ipsum Generator:** Generate custom amounts of placeholder words, sentences, or paragraphs.

### 💻 4. Developer Tools (Formatters & Generators)
Essential offline utilities for software engineers and power users:
*   **JSON Formatter:** Beautify, minify, and syntactically validate JSON structures with immediate error highlight.
*   **Base64 Encoder/Decoder:** Secure local translation of string arrays.
*   **Password Generator:** Highly secure, cryptographically random password generation using the standard `crypto.getRandomValues()` Web API.
*   **URL Tool:** Seamless percent-encoding and decoding for query params.
*   **UUID v4 Generator:** Generate single or batch standard RFC-4122 compliant UUIDs.
*   **Diff Checker:** Perform side-by-side text comparisons utilizing a 100% internal, zero-dependency Longest Common Subsequence (LCS) algorithm for instant difference highlight.
*   **Color Picker:** Visually pick, adjust, and convert color scales (HEX, RGB, HSL).

---

## 💻 Tech Stack & Rationales

The architecture of Lumea was carefully chosen to maximize on-device efficiency, ensure type safety, and offer a premium UI experience:

| Technology | Role in Lumea | Rationale |
| :--- | :--- | :--- |
| **Astro v6** | Core Framework | Astro's hybrid rendering and zero-JS-by-default architecture ensure incredibly fast initial page loads. The integrated i18n routing provides robust multi-language support (English, Indonesian, Spanish) out of the box with zero runtime latency. |
| **React 19 & TypeScript** | Component Layer | React's robust state management powers interactive client components (e.g. PDF page canvases, crop areas). TypeScript guarantees compile-time type-safety across complex file parsers and algorithms. |
| **Tailwind CSS v4** | Design & Styling | Offers high-performance CSS compilation. Tailwind v4's modern utilities enable premium visuals: sleek dark modes, vibrant HSL-tailored colors, elegant glassmorphism, responsive grids, and clean visual layouts. |
| **Framer Motion** | Micro-Animations | Powering rich, smooth transitions and hover micro-animations that make the entire utility suite feel alive, premium, and extremely responsive. |
| **WebAssembly & Web Workers** | Heavy Computation | Multi-threaded client-side execution ensures that complex tasks—like large image compressions or PDF page parsing—happen in background threads, keeping the browser UI completely lag-free. |

### 📦 Key On-Device Packages Utilized:
*   **`pdf-lib` & `pdfjs-dist`:** Perform precise local modifications and render previews of PDF documents.
*   **`@tensorflow/tfjs` & `@mediapipe/selfie_segmentation`:** Local ML execution for private, instant photo background removal.
*   **`tesseract.js`:** Runs a highly accurate optical character recognition engine directly in the browser's sandbox.
*   **`mammoth` & `docx`:** Parse and compile Word `.docx` documents inside browser memory.
*   **`xlsx`:** Process spreadsheet data structures securely.
*   **`@dnd-kit`:** Visual drag-and-drop mechanics for seamless PDF page restructuring.
*   **`imagetracerjs`:** Native SVG path tracing engine.
*   **`bwip-js` & `qrcode`:** High-fidelity barcode/QR rendering.
*   **`browser-image-compression`:** Canvas-based client-side image compression.

---

## 🚀 Installation & Local Development

Run Lumea locally on your machine in just a few steps:

### Prerequisites
Make sure you have **Node.js** (version `>= 22.12.0` recommended) and **npm** installed.

### 1. Clone the Repository
```bash
git clone https://github.com/WahyutegarNugroho/Lumea.git
cd lumea-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Local Development Server
```bash
npm run dev
```
Once started, the local development server will be available at `http://localhost:4321`. Open it in your web browser to explore Lumea.

### 4. Build for Production
To bundle the application into highly optimized static assets:
```bash
npm run build
```
This compiles the site into the `dist/` directory, ready to be hosted on Vercel, Netlify, or any static provider.

### 5. Preview Production Build Locally
```bash
npm run preview
```

---

## 🌐 Localization (i18n)

Lumea features full multi-language localization to be accessible globally:
*   🇺🇸 **English** (Default)
*   🇮🇩 **Indonesian**
*   🇪🇸 **Spanish**

Translations are dynamically matched using Astro's built-in i18n locale sub-paths (`/id/`, `/es/`).

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with 🤍 and client-side processing. Your files, your privacy.
</p>
