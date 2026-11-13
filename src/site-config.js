/**
 * OmniTools — Central Site Configuration, Master Tool Registry (64 Tools), & AEO Content
 * =======================================================================================
 * PRODUCTION SETUP:
 * Edit `SITE_CONFIG.siteUrl` below to match your live domain (no trailing slash)
 * before building/deploying. Every canonical link, OpenGraph URL, and JSON-LD schema
 * reads from this single source of truth via `getOrigin()`.
 */

export const SITE_CONFIG = {
  siteName: 'OmniTools',
  tagline: '64 Free Client-Side Productivity Tools',
  // 👇 UPDATE THIS ONE VALUE TO YOUR PRODUCTION DOMAIN (no trailing slash)
  siteUrl: 'https://YOUR_DOMAIN.com',
  ogImage: '/images/og-banner.svg',
  logoPath: '/images/logo.svg',
  supportEmail: 'support@omnitools.app',
  themeColor: '#4f46e5',
  twitterHandle: '@omnitools'
};

/**
 * Resolves the canonical site origin.
 * Priority: configured non-placeholder `SITE_CONFIG.siteUrl` -> live non-localhost `window.location.origin` -> fallback `SITE_CONFIG.siteUrl`.
 * @returns {string}
 */
export function getOrigin() {
  const configured = (SITE_CONFIG.siteUrl || '').replace(/\/+$/, '');
  if (configured && !configured.includes('YOUR_DOMAIN.com')) {
    return configured;
  }
  if (typeof window !== 'undefined' && window.location && /^https?:\/\//i.test(window.location.origin)) {
    const host = window.location.hostname;
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return window.location.origin.replace(/\/+$/, '');
    }
  }
  return configured || 'https://YOUR_DOMAIN.com';
}

export const CATEGORY_META = {
  pdf: {
    id: 'pdf',
    name: 'PDF Utilities',
    shortLabel: 'PDF',
    icon: 'pdf',
    count: 24,
    anchor: '/#pdf-tools',
    description: 'Convert, merge, split & watermark PDFs',
    applicationCategory: 'UtilitiesApplication',
    accentText: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    faqs: [
      {
        q: 'Are my PDF files uploaded to a remote server during conversion?',
        a: 'No. All OmniTools PDF utilities run 100% client-side inside your browser using JavaScript libraries like pdf.js, pdf-lib, and jsPDF. Your documents never leave your device.'
      },
      {
        q: 'Is there a daily limit or watermark added to converted PDFs?',
        a: 'There are zero usage caps, no paywalls, and no forced watermarks. You can process as many documents as your browser memory supports for free.'
      },
      {
        q: 'Which browsers support OmniTools PDF tools?',
        a: 'All modern evergreen browsers — including Chrome, Edge, Firefox, and Safari on desktop and mobile — support our in-memory PDF processing.'
      }
    ]
  },
  images: {
    id: 'images',
    name: 'Image Editors',
    shortLabel: 'Images',
    icon: 'images',
    count: 6,
    anchor: '/#image-tools',
    description: 'Compress, resize & convert images',
    applicationCategory: 'MultimediaApplication',
    accentText: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    faqs: [
      {
        q: 'How does OmniTools compress and resize images without uploading them?',
        a: 'We use the native HTML5 Canvas and FileReader Web APIs to decode, resize, watermark, and re-encode images strictly in your browser memory.'
      },
      {
        q: 'Will image quality be preserved when converting between JPG and PNG?',
        a: 'Yes. You have full control over quality sliders and compression targets, and PNG exports use lossless encoding while JPG supports adjustable quality.'
      },
      {
        q: 'Can I compress photos to an exact file size like 100KB?',
        a: 'Yes! Our Compress to 100KB utility iteratively tunes compression quality so your passport photos and portal uploads stay strictly under 100KB.'
      }
    ]
  },
  calculators: {
    id: 'calculators',
    name: 'Calculators',
    shortLabel: 'Calculators',
    icon: 'calculators',
    count: 6,
    anchor: '/#calculators',
    description: 'Financial & health calculation tools',
    applicationCategory: 'FinanceApplication',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    faqs: [
      {
        q: 'Are financial and health calculations performed privately on my device?',
        a: 'Yes. Every input — including salary, SIP amounts, tax figures, and health metrics — is computed instantaneously in local JavaScript with zero server logging.'
      },
      {
        q: 'How accurate are the SIP, Compound Interest, and GST formulas?',
        a: 'Our calculators use standard banking and compounding formulas with interactive breakdowns and visual Chart.js projections for clarity.'
      },
      {
        q: 'Do these calculators work offline?',
        a: 'Yes, once loaded or installed as a PWA via our Service Worker, OmniTools calculators function smoothly even without an active internet connection.'
      }
    ]
  },
  seo: {
    id: 'seo',
    name: 'SEO & Web',
    shortLabel: 'SEO',
    icon: 'seo',
    count: 7,
    anchor: '/#seo-tools',
    description: 'Analyze performance, tags & sitemaps',
    applicationCategory: 'DeveloperApplication',
    accentText: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    faqs: [
      {
        q: 'Can I generate production-ready Meta Tags, Robots.txt, and XML Sitemaps?',
        a: 'Yes. Our SEO generators output standards-compliant HTML meta tags, OpenGraph/Twitter Cards, robots.txt directives, and XML sitemaps ready for Google Search Console.'
      },
      {
        q: 'Are my site drafts or keyword lists stored anywhere?',
        a: 'No. Text analysis, keyword density checks, and tag generation occur locally in your browser without saving your copy or URLs to any database.'
      },
      {
        q: 'Do the SEO tools help with AI Answer Engine Optimization (AEO)?',
        a: 'Yes! Clean meta descriptions, semantic OpenGraph tags, and crawlable sitemaps improve visibility in both traditional search engines and AI answer engines.'
      }
    ]
  },
  utilities: {
    id: 'utilities',
    name: 'Utilities',
    shortLabel: 'Utilities',
    icon: 'utilities',
    count: 18,
    anchor: '/#developer-tools',
    description: 'Everyday developer & productivity helpers',
    applicationCategory: 'DeveloperApplication',
    accentText: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    faqs: [
      {
        q: 'Is it safe to format sensitive JSON or generate passwords here?',
        a: 'Yes. Passwords use the browser Web Crypto API (crypto.getRandomValues), and JSON formatting, hashing, and cipher tools run strictly in your local tab memory.'
      },
      {
        q: 'Does the Notes App save my notes between sessions?',
        a: 'Yes, the Notes App persists your scratchpad locally inside your browser localStorage so your notes stay private on your own device.'
      },
      {
        q: 'Can I copy outputs with a single click?',
        a: 'Every OmniTools utility features 1-click Copy to Clipboard and instant download options so you can move quickly between workflows.'
      }
    ]
  },
  'finance-games': {
    id: 'finance-games',
    name: 'Finance & Fun',
    shortLabel: 'Finance & Fun',
    icon: 'finance-games',
    count: 3,
    anchor: '/#financial-tools',
    description: 'Live rates and quick browser games',
    applicationCategory: 'UtilitiesApplication',
    accentText: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    faqs: [
      {
        q: 'How up-to-date are the Currency Converter exchange rates?',
        a: 'The Currency Converter fetches live mid-market exchange rates across 150+ global currencies directly in your browser when online.'
      },
      {
        q: 'Do the browser mini-games require plugins or downloads?',
        a: 'No! Both Flappy Bird Arcade (WebGL) and Tic Tac Toe run natively in your browser with zero installs or sign-ups.'
      },
      {
        q: 'Can I play the games on mobile touchscreens as well as desktop?',
        a: 'Yes. All games and finance tools adapt responsively to mobile viewports and support both touch taps and desktop mouse/keyboard controls.'
      }
    ]
  }
};

function makeTool(raw) {
  const cat = CATEGORY_META[raw.category];
  const defaultHowTo = [
    {
      name: `Open ${raw.title}`,
      text: `Launch ${raw.title} directly in your browser with zero sign-up or installation.`
    },
    {
      name: 'Provide Input or Upload Files',
      text: raw.step2 || `Drop your file or enter your parameters in the left workspace panel—everything stays inside local browser memory.`
    },
    {
      name: 'Preview & Export Instantly',
      text: raw.step3 || `Review the live output on the right panel and copy or download your result in one click.`
    }
  ];

  const toolFaqs = raw.faqs || [
    {
      q: `Is ${raw.title} completely free and private?`,
      a: `Yes. ${raw.title} is 100% free with zero sign-up, and all processing happens strictly in your browser with zero server uploads.`
    },
    ...cat.faqs.slice(0, 2)
  ];

  return {
    id: raw.url.split('/').pop().replace(/\.html$/, '') || raw.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: raw.title,
    url: raw.url,
    category: raw.category,
    categoryLabel: cat.name,
    shortLabel: cat.shortLabel,
    applicationCategory: raw.applicationCategory || cat.applicationCategory,
    description: raw.description,
    icon: raw.icon,
    keywords: raw.keywords || [],
    howTo: raw.howTo || defaultHowTo,
    faqs: toolFaqs
  };
}

const RAW_TOOLS = [
  // ===================== 1. PDF UTILITIES (24) =====================
  {
    title: 'PDF to Word',
    url: '/tools/pdf/pdf-to-word.html',
    category: 'pdf',
    icon: 'document',
    description: 'Convert PDF files into editable Word (.doc) documents client-side.',
    keywords: ['doc', 'docx', 'word', 'extract text', 'pdf converter'],
    step2: 'Drag and drop your PDF file into the upload zone and adjust formatting options if needed.',
    step3: 'Click Convert to extract text and download your editable .doc document immediately.'
  },
  {
    title: 'PDF to Excel',
    url: '/tools/pdf/pdf-to-excel.html',
    category: 'pdf',
    icon: 'table',
    description: 'Extract PDF data tables into editable Excel (.xlsx) spreadsheets.',
    keywords: ['xlsx', 'spreadsheet', 'excel', 'table', 'sheetjs'],
    step2: 'Upload your PDF document containing tabular data and choose single or per-page worksheet layout.',
    step3: 'Preview the extracted table rows and download the generated .xlsx Excel workbook.'
  },
  {
    title: 'PDF to CSV',
    url: '/tools/pdf/pdf-to-csv.html',
    category: 'pdf',
    icon: 'csv',
    description: 'Extract tabular PDF contents into clean CSV spreadsheets.',
    keywords: ['comma separated', 'csv', 'table', 'data'],
    step2: 'Select a PDF file and configure your preferred CSV delimiter (comma, semicolon, tab, or pipe).',
    step3: 'Inspect the live CSV preview and either copy it to clipboard or download the .csv file.'
  },
  {
    title: 'PDF to HTML',
    url: '/tools/pdf/pdf-to-html.html',
    category: 'pdf',
    icon: 'code',
    description: 'Convert PDFs to clean HTML code preserving text and formatting.',
    keywords: ['html5', 'web', 'markup', 'pdf'],
    step2: 'Upload your PDF and choose standalone HTML5 or clean fragment output mode.',
    step3: 'Switch between source code and rendered preview, then copy or download the .html file.'
  },
  {
    title: 'PDF to Text',
    url: '/tools/pdf/pdf-to-text.html',
    category: 'pdf',
    icon: 'doc-text',
    description: 'Extract raw text from PDF documents with instant copy & download.',
    keywords: ['txt', 'plain text', 'extract', 'copy'],
    step2: 'Drop your PDF into the workspace and select page separator and whitespace preferences.',
    step3: 'Review the extracted text stats and copy to clipboard or save as a .txt file.'
  },
  {
    title: 'PDF to JPG',
    url: '/tools/pdf/pdf-to-jpg.html',
    category: 'pdf',
    icon: 'image',
    description: 'Render and export PDF pages as high-quality JPG images.',
    keywords: ['jpeg', 'jpg', 'render', 'rasterize', 'zip'],
    step2: 'Upload your PDF and select render resolution (1x, 1.5x, or 2x Ultra HD) and JPG quality.',
    step3: 'Preview any page on the live canvas and download individual JPGs or all pages as a ZIP archive.'
  },
  {
    title: 'PDF to PNG',
    url: '/tools/pdf/pdf-to-png.html',
    category: 'pdf',
    icon: 'image',
    description: 'Convert PDF pages to lossless PNG images with transparent support.',
    keywords: ['png', 'lossless', 'image', 'pages', 'zip'],
    step2: 'Upload a PDF document and pick your desired DPI render scale.',
    step3: 'Preview rendered pages and download single PNG frames or export every page in a ZIP file.'
  },
  {
    title: 'PDF to WebP',
    url: '/tools/pdf/pdf-to-webp.html',
    category: 'pdf',
    icon: 'zap',
    description: 'Convert PDF pages into lightweight, modern WebP images.',
    keywords: ['webp', 'modern image', 'compress', 'pages'],
    step2: 'Drop your PDF file and tune the WebP quality slider and render scale.',
    step3: 'Download the active page as a .webp image or bundle all pages into a .zip download.'
  },
  {
    title: 'PDF to XML',
    url: '/tools/pdf/pdf-to-xml.html',
    category: 'pdf',
    icon: 'code',
    description: 'Parse and structure PDF text into formatted XML hierarchy.',
    keywords: ['xml', 'structured', 'parse', 'tree'],
    step2: 'Upload your PDF and customize the root XML tag name and indentation depth.',
    step3: 'Verify the formatted XML output and copy or download the .xml file.'
  },
  {
    title: 'PDF to JSON',
    url: '/tools/pdf/pdf-to-json.html',
    category: 'pdf',
    icon: 'json',
    description: 'Extract PDF text and page metadata into structured JSON.',
    keywords: ['json', 'api', 'metadata', 'parse'],
    step2: 'Upload a PDF and select indentation (2 spaces, 4 spaces, or minified) and schema options.',
    step3: 'Copy the structured JSON payload or download it as a .json file.'
  },
  {
    title: 'PDF to ZIP',
    url: '/tools/pdf/pdf-to-zip.html',
    category: 'pdf',
    icon: 'archive',
    description: 'Package and compress PDF documents into secure ZIP archives.',
    keywords: ['zip', 'archive', 'compress', 'bundle'],
    step2: 'Add one or more PDF files, choose bundle or split-by-page mode, and pick compression level.',
    step3: 'Review the archive manifest and download your compressed .zip bundle.'
  },
  {
    title: 'Merge PDF',
    url: '/tools/pdf/merge-pdf.html',
    category: 'pdf',
    icon: 'merge',
    description: 'Combine multiple PDF files into a single unified document.',
    keywords: ['combine', 'join', 'append', 'pdf-lib'],
    step2: 'Upload two or more PDFs and use the reorder arrows to arrange the exact merge sequence.',
    step3: 'Click Merge All Documents to combine pages in-memory and download the unified PDF.'
  },
  {
    title: 'PDF Splitter',
    url: '/tools/pdf/pdf-splitter.html',
    category: 'pdf',
    icon: 'scissors',
    description: 'Split multi-page PDFs into separate documents by page range.',
    keywords: ['split', 'extract pages', 'cut', 'range'],
    step2: 'Upload a multi-page PDF and specify the page ranges or individual pages to extract.',
    step3: 'Generate the split PDF documents and download them right away.'
  },
  {
    title: 'PDF Watermark',
    url: '/tools/pdf/pdf-watermark.html',
    category: 'pdf',
    icon: 'droplet',
    description: 'Add custom text watermarks to your PDF pages securely.',
    keywords: ['stamp', 'confidential', 'watermark', 'protect'],
    step2: 'Upload your PDF and customize watermark text, opacity, angle, font size, and color.',
    step3: 'Apply the watermark across all pages and download your protected PDF.'
  },
  {
    title: 'PNG to PDF',
    url: '/tools/pdf/png-to-pdf.html',
    category: 'pdf',
    icon: 'pdf',
    description: 'Convert PNG images into a clean, downloadable PDF document.',
    keywords: ['image to pdf', 'png', 'photos'],
    step2: 'Upload one or multiple PNG files, reorder them, and set page size, orientation, and margins.',
    step3: 'Click Convert to PDF to compile all PNGs into a crisp multi-page PDF.'
  },
  {
    title: 'JPEG to PDF',
    url: '/tools/pdf/jpeg-to-pdf.html',
    category: 'pdf',
    icon: 'pdf',
    description: 'Turn JPG/JPEG photos into professional PDF documents.',
    keywords: ['jpg to pdf', 'photos', 'album', 'scan'],
    step2: 'Select multiple JPG/JPEG photos, order them in your queue, and choose A4, Letter, or Fit-to-Image.',
    step3: 'Generate your PDF in browser memory and download the final file.'
  },
  {
    title: 'WebP to PDF',
    url: '/tools/pdf/webp-to-pdf.html',
    category: 'pdf',
    icon: 'pdf',
    description: 'Convert modern WebP graphics into standard PDF format.',
    keywords: ['webp', 'image to pdf', 'convert'],
    step2: 'Add WebP images via drag-and-drop and configure page orientation and margin spacing.',
    step3: 'Convert the image queue via offscreen canvas and download your universal PDF.'
  },
  {
    title: 'Text to PDF',
    url: '/tools/pdf/text-to-pdf.html',
    category: 'pdf',
    icon: 'doc-text',
    description: 'Convert plain text and notes into formatted PDF documents.',
    keywords: ['txt', 'notes', 'document', 'print'],
    step2: 'Paste text or upload a .txt/.md file, then set document title, font family, and font size.',
    step3: 'Preview the paginated paper layout and download your formatted PDF.'
  },
  {
    title: 'HTML to PDF',
    url: '/tools/pdf/html-to-pdf.html',
    category: 'pdf',
    icon: 'code',
    description: 'Render HTML code or web snippets directly into PDF pages.',
    keywords: ['html', 'webpage', 'markup', 'render'],
    step2: 'Upload an HTML file or paste HTML markup into the editor and pick page size and orientation.',
    step3: 'Inspect the live sanitized preview and export a clean printable PDF.'
  },
  {
    title: 'Excel to PDF',
    url: '/tools/pdf/excel-to-pdf.html',
    category: 'pdf',
    icon: 'table',
    description: 'Convert Excel spreadsheets (.xlsx) into clean printable PDFs.',
    keywords: ['xlsx', 'xls', 'spreadsheet', 'table'],
    step2: 'Upload your .xlsx or .xls workbook, select the target worksheet, and choose table styling.',
    step3: 'Preview the parsed table rows and click Generate PDF to download.'
  },
  {
    title: 'CSV to PDF',
    url: '/tools/pdf/csv-to-pdf.html',
    category: 'pdf',
    icon: 'csv',
    description: 'Transform CSV datasets into formatted table PDF reports.',
    keywords: ['csv', 'table', 'report', 'spreadsheet'],
    step2: 'Upload a .csv file or paste comma-separated data and set delimiter and header options.',
    step3: 'Review the auto-formatted table preview and export as a clean PDF report.'
  },
  {
    title: 'JSON to PDF',
    url: '/tools/pdf/json-to-pdf.html',
    category: 'pdf',
    icon: 'json',
    description: 'Convert JSON tree datasets into readable PDF documents.',
    keywords: ['json', 'data', 'report', 'table'],
    step2: 'Paste or upload valid JSON and select Structured Table or Pretty-Printed JSON layout.',
    step3: 'Generate and download your formatted JSON PDF document.'
  },
  {
    title: 'XML to PDF',
    url: '/tools/pdf/xml-to-pdf.html',
    category: 'pdf',
    icon: 'code',
    description: 'Render XML files into structured, printable PDF files.',
    keywords: ['xml', 'nodes', 'markup', 'document'],
    step2: 'Upload or paste XML data and choose Node Table or Indented XML rendering.',
    step3: 'Generate the PDF in browser memory and save it locally.'
  },
  {
    title: 'Speech to PDF',
    url: '/tools/pdf/speech-to-pdf.html',
    category: 'pdf',
    icon: 'mic',
    description: 'Transcribe your voice in real-time and export directly as PDF.',
    keywords: ['voice', 'dictation', 'microphone', 'transcribe'],
    step2: 'Choose your spoken language and click Start Recording to dictate live via your microphone.',
    step3: 'Edit the live transcript if needed and export directly to a formatted PDF.'
  },

  // ===================== 2. IMAGE EDITORS (6) =====================
  {
    title: 'Image Compressor',
    url: '/tools/images/image-compressor.html',
    category: 'images',
    icon: 'compress',
    description: 'Reduce image file size with zero quality loss using HTML5 Canvas.',
    keywords: ['shrink', 'optimize', 'jpg', 'png', 'webp', 'reduce size'],
    step2: 'Drop your image into the workspace and adjust the compression quality slider.',
    step3: 'Compare original vs. compressed size side-by-side and download the optimized image.'
  },
  {
    title: 'Image Resizer',
    url: '/tools/images/image-resizer.html',
    category: 'images',
    icon: 'resize',
    description: 'Resize images by width, height, or aspect ratio with instant preview.',
    keywords: ['dimensions', 'pixels', 'scale', 'width', 'height'],
    step2: 'Upload your photo, enter custom pixel dimensions or lock aspect ratio, and pick output format.',
    step3: 'Preview the resized canvas output and download the crisp resized image.'
  },
  {
    title: 'Compress to 100KB',
    url: '/tools/images/image-100kb.html',
    category: 'images',
    icon: 'layers',
    description: 'Optimize photos to strictly under 100KB for portals & forms.',
    keywords: ['100kb', 'passport', 'exam form', 'kb target'],
    step2: 'Upload your photo and confirm the target file size ceiling (100KB or custom KB).',
    step3: 'Let the smart canvas optimizer hit the exact size limit and download immediately.'
  },
  {
    title: 'Image Watermark Adder',
    url: '/tools/images/image-watermark.html',
    category: 'images',
    icon: 'droplet',
    description: 'Add repeated or positioned text watermarks over images.',
    keywords: ['copyright', 'brand', 'stamp', 'overlay'],
    step2: 'Upload an image and customize your watermark text, opacity, font size, color, and position.',
    step3: 'Preview the watermarked image live on canvas and export cleanly.'
  },
  {
    title: 'JPG to PNG Converter',
    url: '/tools/images/jpg-to-png.html',
    category: 'images',
    icon: 'image',
    description: 'Convert JPG photos to PNG format with lossless compression.',
    keywords: ['jpeg', 'png', 'convert', 'lossless'],
    step2: 'Select or drop one or more JPG/JPEG images into the converter.',
    step3: 'Preview the lossless PNG conversion and save the .png file to your device.'
  },
  {
    title: 'PNG to JPG Converter',
    url: '/tools/images/png-to-jpg.html',
    category: 'images',
    icon: 'image',
    description: 'Convert transparent PNG files into high-speed JPG format.',
    keywords: ['png', 'jpg', 'jpeg', 'background fill'],
    step2: 'Upload a PNG image, choose a background fill color for transparency, and set JPG quality.',
    step3: 'Download your lightweight .jpg image instantly.'
  },

  // ===================== 3. CALCULATORS (6) =====================
  {
    title: 'Age Calculator',
    url: '/tools/calculators/age-calculator.html',
    category: 'calculators',
    icon: 'calendar',
    description: 'Calculate your exact age in years, months, days, and total hours.',
    keywords: ['birthday', 'dob', 'date difference', 'days lived'],
    step2: 'Select your Date of Birth and choose a target date (defaults to today).',
    step3: 'Click Calculate Exact Age to view years, months, total days/hours, and birthday countdown.'
  },
  {
    title: 'BMI Calculator',
    url: '/tools/calculators/bmi-calculator.html',
    category: 'calculators',
    icon: 'activity',
    description: 'Evaluate body mass index and healthy weight ranges with charts.',
    keywords: ['body mass index', 'health', 'weight', 'fitness'],
    step2: 'Choose Metric or Imperial units and enter your height and weight.',
    step3: 'View your BMI score, healthy weight category, and visual range gauge.'
  },
  {
    title: 'Compound Interest',
    url: '/tools/calculators/compound-interest.html',
    category: 'calculators',
    icon: 'trending-up',
    description: 'Calculate future investment growth with compound interest charts.',
    keywords: ['finance', 'investing', 'interest', 'savings', 'wealth'],
    step2: 'Enter principal amount, annual interest rate, compounding frequency, and time period.',
    step3: 'Analyze total maturity value, interest earned, and interactive year-by-year charts.'
  },
  {
    title: 'GST Calculator',
    url: '/tools/calculators/gst-calculator.html',
    category: 'calculators',
    icon: 'percent',
    description: 'Quickly compute inclusive and exclusive Goods and Services Tax.',
    keywords: ['tax', 'gst', 'invoice', 'cgst', 'sgst'],
    step2: 'Enter the net or gross amount, choose GST rate slab (5%, 12%, 18%, 28%), and select Exclusive/Inclusive.',
    step3: 'Inspect the instant CGST, SGST, and total payable breakdown.'
  },
  {
    title: 'SIP Calculator',
    url: '/tools/calculators/sip-calculator.html',
    category: 'calculators',
    icon: 'bar-chart',
    description: 'Plan mutual fund systematic investments with interactive projection graphs.',
    keywords: ['mutual fund', 'sip', 'investment', 'returns'],
    step2: 'Set your monthly SIP contribution, expected annual return rate, and investment tenure.',
    step3: 'Review invested capital vs. estimated wealth gain on the interactive growth chart.'
  },
  {
    title: 'Unit Converter',
    url: '/tools/calculators/unit-converter.html',
    category: 'calculators',
    icon: 'scale',
    description: 'Convert length, weight, temperature, area, and volume instantly.',
    keywords: ['metric', 'imperial', 'length', 'weight', 'temperature'],
    step2: 'Select a measurement category, enter a value, and pick source and target units.',
    step3: 'Read the high-precision conversion instantly and copy the result.'
  },

  // ===================== 4. SEO & WEB (7) =====================
  {
    title: 'SEO & Speed Analyzer',
    url: '/tools/seo/seo-analyzer.html',
    category: 'seo',
    icon: 'gauge',
    description: 'Run Google PageSpeed performance & SEO audits on any URL.',
    keywords: ['pagespeed', 'lighthouse', 'audit', 'core web vitals'],
    step2: 'Enter the full website URL you want to audit and choose Mobile or Desktop strategy.',
    step3: 'Review performance scores, SEO diagnostics, and optimization opportunities.'
  },
  {
    title: 'Extract Meta Tags',
    url: '/tools/seo/extract-meta-tags.html',
    category: 'seo',
    icon: 'search',
    description: 'Inspect OpenGraph, Twitter Cards, and SEO meta tags of any site.',
    keywords: ['og tags', 'open graph', 'twitter card', 'inspector'],
    step2: 'Paste a webpage URL or HTML head snippet to inspect its metadata.',
    step3: 'View extracted title, description, canonical, OpenGraph, and Twitter tags clearly.'
  },
  {
    title: 'Meta Tag Generator',
    url: '/tools/seo/meta-tag-generator.html',
    category: 'seo',
    icon: 'tag',
    description: 'Build Google and social media meta tags with live SERP preview.',
    keywords: ['serp', 'head tags', 'opengraph', 'seo'],
    step2: 'Fill in your page title, description, keywords, canonical URL, and OpenGraph image.',
    step3: 'Preview how your page looks in Google search and copy the generated HTML meta block.'
  },
  {
    title: 'Robots.txt Generator',
    url: '/tools/seo/robots-txt-generator.html',
    category: 'seo',
    icon: 'bot',
    description: 'Configure crawl permissions and bot rules with visual controls.',
    keywords: ['crawler', 'googlebot', 'disallow', 'sitemap'],
    step2: 'Select default crawl policy, bot-specific rules, disallowed paths, and your XML sitemap URL.',
    step3: 'Copy or download the ready-to-deploy robots.txt file for your site root.'
  },
  {
    title: 'XML Sitemap Generator',
    url: '/tools/seo/xml-sitemap-generator.html',
    category: 'seo',
    icon: 'sitemap',
    description: 'Crawl internal links and generate search engine XML sitemaps.',
    keywords: ['sitemap.xml', 'seo', 'crawl', 'indexing'],
    step2: 'Enter your website base URL or paste URLs with change frequency and priority weights.',
    step3: 'Generate a standards-compliant sitemap.xml and download it for Search Console.'
  },
  {
    title: 'Website Speed Test',
    url: '/tools/seo/website-speed-test.html',
    category: 'seo',
    icon: 'zap',
    description: 'Benchmark page load metrics, Core Web Vitals, and DNS timing.',
    keywords: ['latency', 'ttfb', 'lcp', 'performance'],
    step2: 'Enter any target domain or URL to run a live browser timing check.',
    step3: 'Examine response latency, load metrics, and speed optimization tips.'
  },
  {
    title: 'Keyword Density',
    url: '/tools/seo/keyword-density.html',
    category: 'seo',
    icon: 'bar-chart',
    description: 'Analyze word frequency and keyword optimization percentages in text.',
    keywords: ['content', 'copywriting', 'ngrams', 'frequency'],
    step2: 'Paste your article or blog draft into the analyzer workspace.',
    step3: 'Review top single keywords, phrases, and density percentages to avoid keyword stuffing.'
  },

  // ===================== 5. UTILITIES & DEV TOOLS (18) =====================
  {
    title: 'YouTube Media Hub',
    url: '/tools/utilities/youtube-video-downloader.html',
    category: 'utilities',
    icon: 'video',
    description: 'Watch videos in a private player, get embed codes & download HD thumbnails.',
    keywords: ['youtube', 'embed', 'video', 'thumbnail'],
    step2: 'Paste any YouTube watch or share URL into the input bar.',
    step3: 'Preview in the privacy-enhanced player, copy responsive embed code, or grab HD thumbnails.'
  },
  {
    title: 'Thumbnail Downloader',
    url: '/tools/utilities/thumbnail-downloader.html',
    category: 'utilities',
    icon: 'image',
    description: 'Extract and download YouTube thumbnails in 1080p, 720p, and 480p.',
    keywords: ['youtube', 'cover', 'maxresdefault', 'hd'],
    step2: 'Paste a YouTube video link or video ID to fetch all available thumbnail resolutions.',
    step3: 'Preview HD, SD, and HQ variants and download your preferred thumbnail.'
  },
  {
    title: 'YouTube Tag Generator',
    url: '/tools/utilities/youtube-tag-generator.html',
    category: 'utilities',
    icon: 'tag',
    description: 'Generate high-ranking SEO tags and keywords for YouTube videos.',
    keywords: ['youtube seo', 'tags', 'keywords', 'creator'],
    step2: 'Enter your video topic, niche, or main keyword phrase.',
    step3: 'Generate optimized YouTube tags and copy the comma-separated list in one click.'
  },
  {
    title: 'Screenshot Taker',
    url: '/tools/utilities/website-screenshot-taker.html',
    category: 'utilities',
    icon: 'camera',
    description: 'Capture any tab, window, or display screen directly in high definition.',
    keywords: ['screen capture', 'snapshot', 'png', 'record'],
    step2: 'Click Capture Screen and grant browser permission for the tab, window, or display you want.',
    step3: 'Preview the captured frame instantly and download it as a crisp PNG image.'
  },
  {
    title: 'QR Code Generator',
    url: '/tools/utilities/qr-code-generator.html',
    category: 'utilities',
    icon: 'qr-code',
    description: 'Generate custom QR codes for URLs, WiFi, emails, and texts.',
    keywords: ['qr', 'barcode', 'wifi qr', 'scan'],
    step2: 'Enter a URL, text, or WiFi credentials and customize QR size and foreground/background colors.',
    step3: 'Scan-test the live QR preview and download it as a high-res PNG.'
  },
  {
    title: 'Password Generator',
    url: '/tools/utilities/password-generator.html',
    category: 'utilities',
    icon: 'lock',
    description: 'Generate cryptographically strong, customizable secure passwords.',
    keywords: ['security', 'random', 'crypto', 'entropy'],
    step2: 'Choose password length and toggle uppercase, lowercase, numbers, and special symbols.',
    step3: 'Check the entropy strength meter and copy your generated password securely.'
  },
  {
    title: 'JSON Formatter & Validator',
    url: '/tools/utilities/json-formatter.html',
    category: 'utilities',
    icon: 'json',
    description: 'Prettify, minify, validate, and inspect JSON payloads with syntax highlighting.',
    keywords: ['prettify', 'lint', 'minify', 'json validator'],
    step2: 'Paste raw or minified JSON into the input editor.',
    step3: 'Format, minify, or validate syntax errors instantly and copy the clean output.'
  },
  {
    title: 'MD5 Hash Generator',
    url: '/tools/utilities/md5-hash-generator.html',
    category: 'utilities',
    icon: 'hash',
    description: 'Compute client-side cryptographic MD5 hashes from any string.',
    keywords: ['checksum', 'digest', 'md5', 'crypto'],
    step2: 'Type or paste any text string into the hash input area.',
    step3: 'View the live 32-character MD5 hexadecimal digest and copy with one click.'
  },
  {
    title: 'Notes App & Scratchpad',
    url: '/tools/utilities/notes-app.html',
    category: 'utilities',
    icon: 'file-edit',
    description: 'Write, edit, and persist notes locally in browser storage.',
    keywords: ['notepad', 'localstorage', 'markdown', 'memo'],
    step2: 'Create a new note or select an existing draft from your local browser list.',
    step3: 'Your edits auto-save immediately to localStorage—zero cloud sync required.'
  },
  {
    title: 'Internet Speed Test',
    url: '/tools/utilities/netspeed-test.html',
    category: 'utilities',
    icon: 'wifi',
    description: 'Test real-time ping, latency, and download throughput.',
    keywords: ['bandwidth', 'mbps', 'ping', 'network'],
    step2: 'Click Start Speed Test to measure round-trip latency and download throughput.',
    step3: 'Inspect your real-time Mbps gauge, ping stats, and connection quality rating.'
  },
  {
    title: 'Word & Character Counter',
    url: '/tools/utilities/word-counter.html',
    category: 'utilities',
    icon: 'type',
    description: 'Count words, characters, sentences, paragraphs, and reading time.',
    keywords: ['essay', 'characters', 'reading time', 'text stats'],
    step2: 'Type or paste your text directly into the writing workspace.',
    step3: 'Watch live word, character, sentence, paragraph, and estimated reading-time counters update.'
  },
  {
    title: 'Caesar Cipher',
    url: '/tools/utilities/caesar-cipher.html',
    category: 'utilities',
    icon: 'key',
    description: 'Encrypt and decrypt text messages using classic shift cryptography.',
    keywords: ['rot13', 'encrypt', 'decrypt', 'shift'],
    step2: 'Enter your message, choose Encrypt or Decrypt mode, and set the alphabet shift key (1–25).',
    step3: 'Copy the transformed ciphertext or plaintext immediately.'
  },
  {
    title: 'Color Code Picker',
    url: '/tools/utilities/color-code.html',
    category: 'utilities',
    icon: 'palette',
    description: 'Pick colors and copy HEX, RGB, HSL, and CMYK formats.',
    keywords: ['hex', 'rgb', 'hsl', 'cmyk', 'eyedropper'],
    step2: 'Pick any hue from the interactive color wheel or enter an existing HEX/RGB value.',
    step3: 'Copy ready-to-use CSS HEX, RGB, HSL, or CMYK codes in one click.'
  },
  {
    title: 'CSS Gradient Generator',
    url: '/tools/utilities/css-gradient-generator.html',
    category: 'utilities',
    icon: 'sparkles',
    description: 'Design linear & radial CSS gradients with 1-click CSS code export.',
    keywords: ['css3', 'linear-gradient', 'radial', 'background'],
    step2: 'Select gradient stops, angle, and linear or radial style.',
    step3: 'Preview the live canvas swatch and copy the cross-browser CSS background rule.'
  },
  {
    title: 'Number to Word',
    url: '/tools/utilities/number-to-word.html',
    category: 'utilities',
    icon: 'type',
    description: 'Spell numbers out into English words for checks and invoices.',
    keywords: ['cheque', 'invoice', 'spelling', 'currency words'],
    step2: 'Enter any integer or decimal number into the input box.',
    step3: 'Copy the properly hyphenated English word representation for checks or legal docs.'
  },
  {
    title: 'Lorem Ipsum Generator',
    url: '/tools/utilities/lorem-ipsum.html',
    category: 'utilities',
    icon: 'doc-text',
    description: 'Generate custom dummy placeholder text for mockups and designs.',
    keywords: ['placeholder', 'dummy text', 'paragraphs', 'ui'],
    step2: 'Choose the number of paragraphs, sentences, or words you need.',
    step3: 'Generate clean placeholder copy and copy it directly into your design or code.'
  },
  {
    title: 'Logo Maker',
    url: '/tools/utilities/logo-maker.html',
    category: 'utilities',
    icon: 'sparkles',
    description: 'Craft simple brand marks and typography logos client-side.',
    keywords: ['brand', 'svg logo', 'icon', 'typography'],
    step2: 'Enter your brand name, select an icon badge, font style, and color palette.',
    step3: 'Preview your live brand mark and export it as a high-resolution image or SVG.'
  },
  {
    title: 'Privacy Policy Generator',
    url: '/tools/utilities/privacy-policy-generator.html',
    category: 'utilities',
    icon: 'shield-check',
    description: 'Generate compliant privacy policies for websites and apps.',
    keywords: ['gdpr', 'ccpa', 'legal', 'compliance'],
    step2: 'Enter your website/app name, contact email, and data collection disclosures.',
    step3: 'Generate a structured privacy policy and copy as HTML or plain text.'
  },

  // ===================== 6. FINANCE & GAMES (3) =====================
  {
    title: 'Currency Converter',
    url: '/tools/finance/currency-converter/index.html',
    category: 'finance-games',
    icon: 'coins',
    description: 'Convert 160+ world currencies with real-time live exchange rates.',
    applicationCategory: 'FinanceApplication',
    keywords: ['forex', 'usd', 'eur', 'inr', 'exchange rate'],
    step2: 'Enter an amount and choose your source and destination currencies (or swap in 1 click).',
    step3: 'See the live mid-market conversion and exchange rate breakdown instantly.'
  },
  {
    title: 'Flappy Bird Game',
    url: '/tools/games/bird-game.html',
    category: 'finance-games',
    icon: 'gamepad',
    description: 'Play the classic flying bird obstacle arcade game in WebGL.',
    applicationCategory: 'GameApplication',
    keywords: ['arcade', 'webgl', 'playcanvas', 'game'],
    step2: 'Press Spacebar, Click, or Tap the screen inside the arcade frame to start flying.',
    step3: 'Navigate through pipe gaps and beat your personal high score right in the browser.'
  },
  {
    title: 'Tic Tac Toe Game',
    url: '/tools/games/tic-tac-toe.html',
    category: 'finance-games',
    icon: 'grid',
    description: 'Play interactive Tic Tac Toe against a friend or smart AI.',
    applicationCategory: 'GameApplication',
    keywords: ['xo', 'board game', 'ai', 'multiplayer'],
    step2: 'Select 2-Player Local or AI Opponent mode to start a match.',
    step3: 'Take turns placing X and O marks and track your win/draw scoreboard.'
  }
];

export const ALL_TOOLS = RAW_TOOLS.map(makeTool);

export const CATEGORIES = Object.values(CATEGORY_META).map(cat => ({
  ...cat,
  links: ALL_TOOLS.filter(t => t.category === cat.id).map(t => ({
    name: t.title,
    url: t.url,
    icon: t.icon
  }))
}));

export const PLATFORM_HOWTO = [
  {
    name: 'Pick Any of 64 Client-Side Tools',
    text: 'Browse by category or press Ctrl+K anywhere to search across PDF, Image, Calculator, SEO, Developer, and Finance utilities.'
  },
  {
    name: 'Drop Files or Enter Inputs Locally',
    text: 'Everything executes strictly inside your browser using HTML5 Canvas, Web Crypto, and in-memory JS engines—zero server uploads.'
  },
  {
    name: 'Preview, Copy, or Download Instantly',
    text: 'Inspect live previews, bookmark frequent tools, and export your results in one click.'
  }
];

export const PLATFORM_FAQS = [
  {
    q: 'Are files uploaded to any server on OmniTools?',
    a: 'No. Every OmniTools converter, image editor, hash generator, and calculator runs 100% locally in your browser memory with zero server uploads and zero data retention.'
  },
  {
    q: 'Is OmniTools completely free without limits or sign-ups?',
    a: 'Yes. All 64 utilities are completely free to use with no account registration, no paywalls, and no artificial file limits.'
  },
  {
    q: 'Can I use OmniTools offline as a PWA?',
    a: 'Yes. OmniTools ships with a Web App Manifest and Service Worker so you can install it on desktop or mobile and access tools even offline.'
  }
];

/**
 * Normalize a pathname to match tool registry URLs.
 * @param {string} pathname
 */
export function normalizePath(pathname) {
  if (!pathname) return '/';
  let clean = pathname.split('?')[0].split('#')[0];
  if (clean === '/index.html') return '/';
  return clean;
}

/**
 * Find the tool entry matching a URL pathname.
 * @param {string} pathname
 */
export function getToolByUrl(pathname) {
  const clean = normalizePath(pathname);
  return ALL_TOOLS.find(t => t.url === clean) || null;
}

/**
 * Get category metadata by id.
 * @param {string} id
 */
export function getCategoryById(id) {
  return CATEGORY_META[id] || null;
}

/**
 * Return up to `limit` related tools (preferring same category, excluding current tool).
 * @param {object|null} currentTool
 * @param {number} [limit=4]
 */
export function getRelatedTools(currentTool, limit = 4) {
  if (!currentTool) return ALL_TOOLS.slice(0, limit);
  const sameCat = ALL_TOOLS.filter(
    t => t.category === currentTool.category && t.url !== currentTool.url
  );
  if (sameCat.length >= limit) {
    return sameCat.slice(0, limit);
  }
  const fallback = ALL_TOOLS.filter(
    t => t.category !== currentTool.category && t.url !== currentTool.url
  );
  return [...sameCat, ...fallback].slice(0, limit);
}
