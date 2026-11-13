# OmniTools v2.0

![OmniTools](https://img.shields.io/badge/OmniTools-v2.0.0-6366f1?style=flat-square)
![Client-Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-10b981?style=flat-square)
![Tools](https://img.shields.io/badge/Utilities-64%20Tools-8b5cf6?style=flat-square)
![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-0ea5e9?style=flat-square)

**OmniTools v2.0** is an all-in-one, high-performance productivity portal offering **64 free, 100% client-side tools** across PDF conversion, image editing, SEO & AEO utilities, financial calculators, developer helpers, and browser mini-games. Every operation runs locally inside the user's browser memory with zero server uploads and zero data retention.

---

## Core Highlights

- **100% Client-Side Privacy**: Files and inputs never leave the browser (`FileReader`, `Canvas`, `Blob`, `pdf.js`, `pdf-lib`, `jsPDF`, `SheetJS`, `JSZip`).
- **Zero-HTTP-Request Inline SVG System**: All 64 tool cards, navigation menus, and badges use crisp, semantic inline SVG vector icons (`src/icons.js`).
- **Linear / SaaS Split 2-Column Workspace**: Consistent, mobile-responsive interface across every tool with dark/light theme persistence.
- **Global Command Palette (`Ctrl+K` / `/`)**: Instant fuzzy search and keyboard navigation across all 64 tools from any page.
- **Technical SEO & AEO Ready**: Built-in `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, dynamic OpenGraph/Canonical metadata, and JSON-LD `@graph` (`WebSite`, `Organization`, `BreadcrumbList`, `SoftwareApplication`, `HowTo`, `FAQPage`).
- **Installable PWA**: Includes `manifest.webmanifest` and a network-first Service Worker (`sw.js`) for offline resilience.

---

## Tech Stack

- **Bundler**: [Vite](https://vitejs.dev/) (`vite@^8`) with dynamic multi-page HTML entry discovery (`vite.config.js`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`, compiled via `src/input.css`)
- **Architecture**: Vanilla ES6+ JavaScript modules (`src/layout.js`, `src/site-config.js`, `src/icons.js`)
- **Client-Side Engines**: `pdf.js`, `pdf-lib`, `jsPDF`, `jspdf-autotable`, `SheetJS (xlsx)`, `JSZip`, `Chart.js`, `QRCode.js`, `CryptoJS`, `html2canvas`, Web Speech API, Canvas 2D

---

## Project Structure

```text
├── index.html                  # Homepage portal with Bento grids, live filter & static JSON-LD
├── contactus.html              # Support & feedback workspace
├── privacy.html                # Official zero-retention privacy policy
├── under_maintenance.html      # System status / maintenance page
├── vite.config.js              # Multi-page HTML entrypoint builder
├── images/                     # Source vector logo & OG banner (logo.svg, og-banner.svg)
├── public/                     # Static root assets copied verbatim to dist/
│   ├── images/                 # Vector assets served at /images/*
│   ├── llms.txt                # Concise LLM / Answer Engine index
│   ├── llms-full.txt           # Full 64-tool LLM knowledge directory
│   ├── manifest.webmanifest    # PWA manifest
│   ├── robots.txt              # Search & AI crawler directives
│   ├── sitemap.xml             # Full XML sitemap (67 URLs)
│   └── sw.js                   # Service Worker
├── src/
│   ├── icons.js                # Inline SVG vector icon registry
│   ├── input.css               # Tailwind v4 entry & shared component tokens
│   ├── layout.js               # Header, Drawer, Breadcrumbs, Command Palette, AEO & JSON-LD injector
│   └── site-config.js          # Domain config & master registry of all 64 tools
└── tools/
    ├── calculators/            # 6 financial & health calculators
    ├── finance/                # Currency converter module
    ├── games/                  # Browser mini-games (Flappy Bird, Tic Tac Toe)
    ├── images/                 # 6 client-side image processors & converters
    ├── pdf/                    # 24 PDF converters, merger, splitter & watermark tools
    ├── seo/                    # 7 SEO analyzers, generators & speed tools
    └── utilities/              # 18 developer, text, QR, hash, cipher & media utilities
```

---

## Tool Categories (64 Tools)

| Category | Count | Highlights |
|---|---|---|
| **PDF Suite** | 24 | Merge, Split, Watermark, PDF ↔ Word/Excel/CSV/JSON/XML/HTML/Text/JPG/PNG/WebP/ZIP, Speech to PDF |
| **Utilities** | 18 | JSON Formatter, QR Code, Password Generator, MD5 Hash, Word Counter, Color Picker, CSS Gradient, Notes |
| **SEO & Web** | 7 | Meta Tag Generator & Extractor, Robots.txt, XML Sitemap, Keyword Density, SEO Analyzer, Speed Test |
| **Image Editors** | 6 | Image Compressor, Compress to 100KB, Resizer, Watermark Adder, JPG ↔ PNG |
| **Calculators** | 6 | Age, BMI, SIP, Compound Interest, GST, Unit Converter |
| **Finance & Fun** | 3 | Live Currency Converter (150+ currencies), Tic Tac Toe (vs AI), Flappy Bird Arcade |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start local development server (http://localhost:3000)
npm run dev

# 3. Build optimized static bundle into dist/
npm run build

# 4. Preview production build locally
npm run preview
```

---

## Custom Domain Configuration

Before deploying to your production domain, replace `https://YOUR_DOMAIN.com` with your actual domain in:

1. `src/site-config.js` (`SITE_CONFIG.siteUrl`)
2. `index.html` (`canonical`, `og:url`, `og:image`, `twitter:image`, and JSON-LD `@graph`)
3. `public/robots.txt`
4. `public/sitemap.xml`
5. `public/llms.txt` & `public/llms-full.txt`

---

## Deployment

Run `npm run build` and deploy the generated `dist/` directory to any static hosting provider:

- **Netlify / Vercel / Cloudflare Pages**: Build command `npm run build`, Output directory `dist`
- **GitHub Pages**: Publish contents of `dist/`

---

## License

Copyright © 2026 OmniTools.
