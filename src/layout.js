/**
 * OmniTools — Universal Shared Layout, Command Palette, AEO & SEO System
 * =========================================================================
 * - Persistent Dark/Light theme switching
 * - Unified Linear-style responsive Header, Mega Dropdown & Mobile Drawer (100% Inline SVG)
 * - Global Command Palette Modal (Ctrl+K or /) across all 64+ pages
 * - Tool Breadcrumb Action Bar (Share/Copy Link + Toast, Shortcuts ?, Bookmark)
 * - Automatic 3-Step How-To, Interactive FAQ Accordion & 4 Related Tools injection on /tools/
 * - Dynamic Technical SEO & AEO Auto-Injector (Canonical, Manifest, OG, Twitter, @graph JSON-LD)
 * - Production Service Worker registration (/sw.js)
 */

import {
  SITE_CONFIG,
  CATEGORIES,
  CATEGORY_META,
  ALL_TOOLS,
  PLATFORM_HOWTO,
  PLATFORM_FAQS,
  getOrigin,
  normalizePath,
  getToolByUrl,
  getCategoryById,
  getRelatedTools
} from './site-config.js';
import { getIconSvg } from './icons.js';

export { CATEGORIES, ALL_TOOLS, SITE_CONFIG };

// 1. Initialize Theme Immediately (prevents FOUC)
(function initTheme() {
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// =========================================================================
// Toast Notifications
// =========================================================================
let toastTimeout = null;
export function showToast(message, iconName = 'check') {
  let existing = document.getElementById('omnitools-toast');
  if (existing) existing.remove();
  if (toastTimeout) clearTimeout(toastTimeout);

  const toast = document.createElement('div');
  toast.id = 'omnitools-toast';
  toast.className = 'omnitools-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <span class="text-emerald-400 dark:text-emerald-600 shrink-0">${getIconSvg(iconName, 'w-4 h-4')}</span>
    <span>${escapeHtml(message)}</span>
  `;
  document.body.appendChild(toast);

  toastTimeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    setTimeout(() => toast.remove(), 220);
  }, 2400);
}

// =========================================================================
// LocalStorage Helpers: Favorites & Recents
// =========================================================================
export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('omnitools_favorites') || '[]');
  } catch {
    return [];
  }
}

export function isFavorite(url) {
  const favs = getFavorites();
  const clean = normalizePath(url);
  return favs.some(f => normalizePath(f.url) === clean);
}

export function toggleFavorite(tool) {
  let favs = getFavorites();
  const cleanUrl = normalizePath(tool.url);
  const index = favs.findIndex(f => normalizePath(f.url) === cleanUrl);
  const registryTool = getToolByUrl(cleanUrl);

  if (index > -1) {
    favs.splice(index, 1);
  } else {
    favs.push({
      title: tool.title || registryTool?.title || 'Tool',
      url: cleanUrl,
      icon: registryTool?.icon || tool.icon || 'sparkles'
    });
  }
  localStorage.setItem('omnitools_favorites', JSON.stringify(favs));
  updateFavoriteButtons();
  renderQuickAccess();
  return index === -1;
}

export function getRecents() {
  try {
    return JSON.parse(localStorage.getItem('omnitools_recent') || '[]');
  } catch {
    return [];
  }
}

export function recordCurrentRecent() {
  const path = normalizePath(window.location.pathname);
  if (!path.includes('/tools/')) return;

  const registryTool = getToolByUrl(path);
  const title = registryTool?.title || (document.title ? document.title.split('—')[0].split('-')[0].trim() : 'Tool');
  const icon = registryTool?.icon || 'sparkles';

  let recs = getRecents().filter(r => normalizePath(r.url) !== path);
  recs.unshift({
    title,
    url: path,
    icon,
    time: Date.now()
  });
  localStorage.setItem('omnitools_recent', JSON.stringify(recs.slice(0, 6)));
}

// =========================================================================
// Theme Switching
// =========================================================================
function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeToggleButtons(isDark);
}

function updateThemeToggleButtons(isDark) {
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    const isDrawerBtn = btn.getAttribute('data-variant') === 'drawer';
    if (isDrawerBtn) {
      btn.innerHTML = isDark
        ? `<span class="inline-flex items-center gap-1.5 text-amber-500">${getIconSvg('sun', 'w-3.5 h-3.5')} <span>Light</span></span>`
        : `<span class="inline-flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">${getIconSvg('moon', 'w-3.5 h-3.5')} <span>Dark</span></span>`;
    } else {
      btn.innerHTML = isDark
        ? getIconSvg('sun', 'w-4 h-4 text-amber-400')
        : getIconSvg('moon', 'w-4 h-4 text-zinc-600 dark:text-zinc-300');
    }
  });
}

function updateFavoriteButtons() {
  const favs = getFavorites();
  document.querySelectorAll('.fav-star-btn').forEach(btn => {
    const url = normalizePath(btn.getAttribute('data-tool-url'));
    const isFav = favs.some(f => normalizePath(f.url) === url);
    const isBreadcrumb = !!btn.closest('#universal-breadcrumbs');

    if (isBreadcrumb) {
      btn.innerHTML = isFav
        ? `${getIconSvg('star-filled', 'w-3.5 h-3.5 text-amber-400')} <span class="font-medium text-amber-600 dark:text-amber-400 hidden sm:inline">Bookmarked</span>`
        : `${getIconSvg('star', 'w-3.5 h-3.5 text-zinc-400')} <span class="hidden sm:inline">Bookmark</span>`;
    } else {
      btn.innerHTML = isFav
        ? getIconSvg('star-filled', 'w-3.5 h-3.5 text-amber-400')
        : getIconSvg('star', 'w-3.5 h-3.5 text-zinc-400 hover:text-amber-400');
    }
  });
}

// =========================================================================
// Header, Mega Dropdown & Mobile Drawer (100% Inline SVG)
// =========================================================================
function createHeaderHTML() {
  const isDark = document.documentElement.classList.contains('dark');
  const sunMoonIcon = isDark
    ? getIconSvg('sun', 'w-4 h-4 text-amber-400')
    : getIconSvg('moon', 'w-4 h-4 text-zinc-600 dark:text-zinc-300');

  const categoriesDropdownItems = CATEGORIES.map(cat => `
    <div class="p-3 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 rounded-xl transition-colors">
      <div class="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100 text-xs mb-2">
        <span class="w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${cat.iconBg}">
          ${getIconSvg(cat.icon, 'w-3.5 h-3.5')}
        </span>
        <a href="${cat.anchor}" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate">${escapeHtml(cat.name)}</a>
        <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium ml-auto">${cat.count}</span>
      </div>
      <div class="space-y-1 pl-8">
        ${cat.links.slice(0, 3).map(link => `
          <a href="${link.url}" class="block text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-0.5 truncate">${escapeHtml(link.name)}</a>
        `).join('')}
      </div>
    </div>
  `).join('');

  return `
    <header id="universal-header" class="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-zinc-950/85 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 gap-3">
          
          <!-- Logo & Brand -->
          <div class="flex items-center gap-2.5 min-w-0">
            <button id="mobile-menu-trigger" type="button" aria-label="Open menu" class="lg:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <a href="/" class="flex items-center gap-2.5 group min-w-0">
              <img src="/images/logo.svg" alt="OmniTools Logo" class="h-8 w-8 shrink-0 transition-transform group-hover:scale-105" />
              <div class="flex flex-col min-w-0">
                <span class="font-extrabold text-base leading-tight tracking-tight text-zinc-900 dark:text-white">Omni<span class="text-indigo-600 dark:text-indigo-400">Tools</span></span>
                <span class="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-semibold hidden sm:inline truncate">Universal Productivity</span>
              </div>
            </a>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex items-center gap-1 font-medium text-xs" aria-label="Primary Navigation">
            <a href="/" class="px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 transition-colors">Explore Tools</a>
            
            <!-- Categories Dropdown Button -->
            <div class="relative group">
              <button type="button" class="flex items-center gap-1 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer">
                <span>Categories</span>
                <svg class="w-3.5 h-3.5 text-zinc-400 group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>

              <!-- Mega Dropdown Menu -->
              <div class="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[680px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto grid grid-cols-3 gap-2 z-50">
                ${categoriesDropdownItems}
              </div>
            </div>

            <a href="/privacy.html" class="px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 transition-colors">Privacy</a>
            <a href="/contactus.html" class="px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 transition-colors">Support</a>
          </nav>

          <!-- Right Action Controls -->
          <div class="flex items-center gap-2 shrink-0">
            <!-- Global Command Palette Trigger -->
            <button id="command-palette-trigger" type="button" aria-label="Search all 64 tools (Ctrl+K)" class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 text-xs transition-colors border border-zinc-200/60 dark:border-zinc-700/60 cursor-pointer">
              ${getIconSvg('search', 'w-3.5 h-3.5 shrink-0')}
              <span class="hidden md:inline">Search tools...</span>
              <kbd class="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded shadow-2xs text-zinc-400">Ctrl+K</kbd>
            </button>

            <!-- Dark / Light Mode Switcher -->
            <button type="button" class="theme-toggle-btn p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer border border-zinc-200/60 dark:border-zinc-700/60" aria-label="Toggle dark mode">
              ${sunMoonIcon}
            </button>

            <!-- All Tools Button -->
            <a href="/" class="btn-primary text-xs !py-1.5 !px-3.5 hidden sm:inline-flex">
              <span>All ${ALL_TOOLS.length} Tools</span>
              ${getIconSvg('arrow-right', 'w-3.5 h-3.5')}
            </a>
          </div>

        </div>
      </div>
    </header>
  `;
}

function createMobileDrawerHTML() {
  const isDark = document.documentElement.classList.contains('dark');
  const categoriesList = CATEGORIES.map(cat => `
    <div class="border-b border-zinc-100 dark:border-zinc-800/80 py-3">
      <div class="flex items-center justify-between text-zinc-900 dark:text-white font-semibold text-xs mb-2">
        <span class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${cat.iconBg}">
            ${getIconSvg(cat.icon, 'w-3.5 h-3.5')}
          </span>
          <span>${escapeHtml(cat.name)}</span>
        </span>
        <span class="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full font-normal">${cat.count}</span>
      </div>
      <div class="grid grid-cols-2 gap-1.5 pl-8">
        ${cat.links.map(l => `
          <a href="${l.url}" class="text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 py-1 truncate">${escapeHtml(l.name)}</a>
        `).join('')}
      </div>
    </div>
  `).join('');

  return `
    <div id="mobile-drawer-backdrop" class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 opacity-0 pointer-events-none transition-opacity duration-300"></div>
    <aside id="mobile-drawer" aria-label="Mobile Navigation" class="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-zinc-950 z-50 shadow-2xl -translate-x-full transition-transform duration-300 ease-in-out flex flex-col border-r border-zinc-200 dark:border-zinc-800">
      <!-- Drawer Header -->
      <div class="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div class="flex items-center gap-2.5">
          <img src="/images/logo.svg" alt="OmniTools" class="h-7 w-7" />
          <span class="font-extrabold text-base text-zinc-900 dark:text-white">Omni<span class="text-indigo-600 dark:text-indigo-400">Tools</span></span>
        </div>
        <button id="mobile-drawer-close" type="button" aria-label="Close menu" class="p-1.5 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
          ${getIconSvg('x', 'w-5 h-5')}
        </button>
      </div>

      <!-- Quick Action: Search & Theme -->
      <div class="p-3 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2">
        <button id="drawer-search-trigger" type="button" class="flex-1 flex items-center gap-2 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 cursor-pointer">
          ${getIconSvg('search', 'w-3.5 h-3.5 shrink-0')}
          <span>Search ${ALL_TOOLS.length} tools...</span>
        </button>
        <button type="button" data-variant="drawer" class="theme-toggle-btn px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-zinc-800 shadow-2xs border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 cursor-pointer shrink-0">
          ${isDark
            ? `<span class="inline-flex items-center gap-1.5 text-amber-500">${getIconSvg('sun', 'w-3.5 h-3.5')} <span>Light</span></span>`
            : `<span class="inline-flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">${getIconSvg('moon', 'w-3.5 h-3.5')} <span>Dark</span></span>`}
        </button>
      </div>

      <!-- Drawer Links & Categories -->
      <div class="flex-1 overflow-y-auto p-4 space-y-1">
        <a href="/" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-900 dark:text-white text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-indigo-600 transition-colors">
          <span class="text-zinc-500 dark:text-zinc-400">${getIconSvg('home', 'w-4 h-4')}</span>
          <span>Home Portal</span>
        </a>
        <a href="/privacy.html" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-900 dark:text-white text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-indigo-600 transition-colors">
          <span class="text-emerald-600 dark:text-emerald-400">${getIconSvg('shield-check', 'w-4 h-4')}</span>
          <span>Privacy Policy</span>
        </a>
        <a href="/contactus.html" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-900 dark:text-white text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-indigo-600 transition-colors">
          <span class="text-indigo-600 dark:text-indigo-400">${getIconSvg('mail', 'w-4 h-4')}</span>
          <span>Support</span>
        </a>

        <div class="pt-3">
          <p class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-3 mb-2">Categories</p>
          ${categoriesList}
        </div>
      </div>

      <!-- Drawer Footer -->
      <div class="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-center">
        <span class="privacy-badge">
          ${getIconSvg('shield-check', 'w-3.5 h-3.5')}
          <span>100% Client-Side Privacy</span>
        </span>
      </div>
    </aside>
  `;
}

// =========================================================================
// Breadcrumb & Tool Action Bar (Share/Copy Link, Shortcuts ?, Bookmark)
// =========================================================================
function createBreadcrumbsHTML() {
  const path = normalizePath(window.location.pathname);
  if (path === '/' || path === '') {
    return '';
  }

  const tool = getToolByUrl(path);
  let categoryName = tool?.categoryLabel || 'Tools';
  let categoryLink = '/';

  if (tool) {
    const catMeta = getCategoryById(tool.category);
    if (catMeta) {
      categoryName = catMeta.name;
      categoryLink = catMeta.anchor;
    }
  } else if (path.includes('/pdf/')) {
    categoryName = 'PDF Utilities';
    categoryLink = '/#pdf-tools';
  } else if (path.includes('/images/')) {
    categoryName = 'Image Editors';
    categoryLink = '/#image-tools';
  } else if (path.includes('/calculators/')) {
    categoryName = 'Calculators';
    categoryLink = '/#calculators';
  } else if (path.includes('/seo/')) {
    categoryName = 'SEO & Web';
    categoryLink = '/#seo-tools';
  } else if (path.includes('/utilities/')) {
    categoryName = 'Utilities';
    categoryLink = '/#developer-tools';
  } else if (path.includes('/finance/')) {
    categoryName = 'Finance';
    categoryLink = '/#financial-tools';
  } else if (path.includes('/games/')) {
    categoryName = 'Games';
    categoryLink = '/#games';
  }

  const pageTitle = tool?.title || (document.title ? document.title.split('—')[0].split('-')[0].trim() : 'Tool');
  const isToolPage = path.includes('/tools/');
  const isFav = isFavorite(path);

  return `
    <div id="universal-breadcrumbs" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/60 dark:border-zinc-800/60">
      <nav class="flex items-center gap-1.5 sm:gap-2 text-xs text-zinc-500 dark:text-zinc-400 min-w-0" aria-label="Breadcrumb">
        <a href="/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1 shrink-0">
          ${getIconSvg('home', 'w-3.5 h-3.5')}
          <span>Home</span>
        </a>
        ${isToolPage ? `
          <span class="text-zinc-400 shrink-0">${getIconSvg('chevron-right', 'w-3 h-3')}</span>
          <a href="${categoryLink}" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate max-w-[110px] sm:max-w-none">${escapeHtml(categoryName)}</a>
        ` : ''}
        <span class="text-zinc-400 shrink-0">${getIconSvg('chevron-right', 'w-3 h-3')}</span>
        <span class="font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[160px] sm:max-w-none">${escapeHtml(pageTitle)}</span>
      </nav>

      <!-- Tool Action Bar -->
      <div class="flex items-center gap-1.5 shrink-0">
        <!-- Share / Copy Link -->
        <button id="share-tool-btn" type="button" aria-label="Copy link to share" title="Share / Copy Link" class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-all cursor-pointer border border-zinc-200/60 dark:border-zinc-700/60">
          ${getIconSvg('share', 'w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400')}
          <span class="hidden sm:inline">Share</span>
        </button>

        <!-- Keyboard Shortcuts (?) -->
        <button id="shortcuts-help-btn" type="button" aria-label="Keyboard shortcuts" title="Keyboard shortcuts (?)" class="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-all cursor-pointer border border-zinc-200/60 dark:border-zinc-700/60">
          ${getIconSvg('keyboard', 'w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400')}
          <kbd class="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">?</kbd>
        </button>

        <!-- Bookmark button -->
        <button type="button" class="fav-star-btn inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-all cursor-pointer border border-zinc-200/60 dark:border-zinc-700/60" data-tool-url="${escapeHtml(path)}" data-tool-title="${escapeHtml(pageTitle)}" aria-label="Bookmark tool">
          ${isFav
            ? `${getIconSvg('star-filled', 'w-3.5 h-3.5 text-amber-400')} <span class="font-medium text-amber-600 dark:text-amber-400 hidden sm:inline">Bookmarked</span>`
            : `${getIconSvg('star', 'w-3.5 h-3.5 text-zinc-400')} <span class="hidden sm:inline">Bookmark</span>`}
        </button>
      </div>
    </div>
  `;
}

// =========================================================================
// Footer
// =========================================================================
function createFooterHTML() {
  return `
    <footer id="universal-footer" class="bg-zinc-950 text-zinc-400 border-t border-zinc-800/80 mt-20 transition-colors">
      <!-- Upper Footer Grid -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          <!-- Brand & Privacy Column -->
          <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center gap-2.5">
              <img src="/images/logo.svg" alt="OmniTools" class="h-8 w-8" />
              <span class="font-extrabold text-xl text-white">Omni<span class="text-indigo-400">Tools</span></span>
            </div>
            <p class="text-xs text-zinc-400 leading-relaxed max-w-sm font-normal">
              An all-in-one suite of ${ALL_TOOLS.length} modern client-side productivity utilities. Every file conversion and calculation runs strictly inside your local browser memory with 100% zero server uploads.
            </p>
            <div class="privacy-badge">
              ${getIconSvg('shield-check', 'w-3.5 h-3.5 shrink-0')}
              <span>100% Client-Side • Zero Data Retention</span>
            </div>
          </div>

          <!-- Column 1: Popular PDF Tools -->
          <div>
            <h4 class="text-white font-semibold text-xs uppercase tracking-wider mb-4">PDF Suite</h4>
            <ul class="space-y-2 text-xs text-zinc-400">
              <li><a href="/tools/pdf/pdf-to-word.html" class="hover:text-indigo-400 transition-colors">PDF to Word</a></li>
              <li><a href="/tools/pdf/pdf-to-excel.html" class="hover:text-indigo-400 transition-colors">PDF to Excel</a></li>
              <li><a href="/tools/pdf/merge-pdf.html" class="hover:text-indigo-400 transition-colors">Merge PDF</a></li>
              <li><a href="/tools/pdf/pdf-splitter.html" class="hover:text-indigo-400 transition-colors">PDF Splitter</a></li>
              <li><a href="/tools/pdf/pdf-watermark.html" class="hover:text-indigo-400 transition-colors">PDF Watermark</a></li>
              <li><a href="/tools/pdf/pdf-to-zip.html" class="hover:text-indigo-400 transition-colors">PDF to ZIP</a></li>
            </ul>
          </div>

          <!-- Column 2: Media & Calculators -->
          <div>
            <h4 class="text-white font-semibold text-xs uppercase tracking-wider mb-4">Popular Tools</h4>
            <ul class="space-y-2 text-xs text-zinc-400">
              <li><a href="/tools/images/image-compressor.html" class="hover:text-indigo-400 transition-colors">Image Compressor</a></li>
              <li><a href="/tools/images/image-resizer.html" class="hover:text-indigo-400 transition-colors">Image Resizer</a></li>
              <li><a href="/tools/calculators/age-calculator.html" class="hover:text-indigo-400 transition-colors">Age Calculator</a></li>
              <li><a href="/tools/calculators/bmi-calculator.html" class="hover:text-indigo-400 transition-colors">BMI Calculator</a></li>
              <li><a href="/tools/calculators/sip-calculator.html" class="hover:text-indigo-400 transition-colors">SIP Calculator</a></li>
              <li><a href="/tools/utilities/youtube-video-downloader.html" class="hover:text-indigo-400 transition-colors">YouTube Media Hub</a></li>
            </ul>
          </div>

          <!-- Column 3: Navigation & Legal -->
          <div>
            <h4 class="text-white font-semibold text-xs uppercase tracking-wider mb-4">Platform</h4>
            <ul class="space-y-2 text-xs text-zinc-400">
              <li><a href="/" class="hover:text-indigo-400 transition-colors">Home Portal</a></li>
              <li><a href="/privacy.html" class="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="/contactus.html" class="hover:text-indigo-400 transition-colors">Support & Feedback</a></li>
              <li><a href="/tools/finance/currency-converter/index.html" class="hover:text-indigo-400 transition-colors">Currency Converter</a></li>
              <li><a href="/tools/games/bird-game.html" class="hover:text-indigo-400 transition-colors">Mini Games</a></li>
            </ul>
          </div>

        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-zinc-900 bg-black/40 py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© ${new Date().getFullYear()} OmniTools. 100% Client-Side Privacy Guaranteed.</p>
          <div class="flex items-center gap-6">
            <a href="/privacy.html" class="hover:text-indigo-400 transition-colors">Privacy Policy</a>
            <a href="/contactus.html" class="hover:text-indigo-400 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// =========================================================================
// Global Command Palette Modal (Ctrl+K or /) across ALL pages
// =========================================================================
let cmdPaletteOpen = false;
let cmdSelectedIndex = 0;
let cmdCurrentMatches = [];

function fuzzyScore(query, tool) {
  const q = query.trim().toLowerCase();
  if (!q) return 1;

  const title = tool.title.toLowerCase();
  const cat = tool.categoryLabel.toLowerCase();
  const desc = tool.description.toLowerCase();
  const kw = (tool.keywords || []).join(' ').toLowerCase();

  if (title === q) return 1000;
  if (title.startsWith(q)) return 600;
  if (title.includes(q)) return 400;
  if (kw.includes(q)) return 260;
  if (cat.includes(q)) return 200;
  if (desc.includes(q)) return 150;

  // Multi-word AND check
  const tokens = q.split(/\s+/).filter(Boolean);
  const haystack = `${title} ${cat} ${kw} ${desc}`;
  if (tokens.length > 1 && tokens.every(tok => haystack.includes(tok))) {
    return 180;
  }

  // Ordered subsequence fuzzy match against title
  let qi = 0;
  let consecutive = 0;
  let score = 0;
  for (let i = 0; i < title.length && qi < q.length; i++) {
    if (title[i] === q[qi]) {
      qi++;
      consecutive++;
      score += 10 + consecutive * 5;
    } else {
      consecutive = 0;
    }
  }
  return qi === q.length ? score : 0;
}

function createCommandPaletteHTML() {
  return `
    <div id="command-palette-modal" class="cmd-palette-backdrop hidden" role="dialog" aria-modal="true" aria-labelledby="cmd-palette-label">
      <div class="cmd-palette-dialog">
        <div class="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800">
          <span class="text-indigo-500 shrink-0">${getIconSvg('search', 'w-5 h-5')}</span>
          <label id="cmd-palette-label" for="cmd-palette-input" class="sr-only">Search all ${ALL_TOOLS.length} tools</label>
          <input
            id="cmd-palette-input"
            type="text"
            placeholder="Jump to any of ${ALL_TOOLS.length} tools (e.g. 'merge pdf', 'compress', 'json', 'sip')..."
            autocomplete="off"
            spellcheck="false"
            class="w-full bg-transparent text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
          />
          <button id="cmd-palette-close" type="button" aria-label="Close search" class="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
            ${getIconSvg('x', 'w-4 h-4')}
          </button>
        </div>

        <div id="cmd-palette-results" role="listbox" class="max-h-[55vh] overflow-y-auto p-2 space-y-1"></div>

        <div class="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/60 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center gap-1"><kbd class="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[10px]">↑↓</kbd> Navigate</span>
            <span class="inline-flex items-center gap-1"><kbd class="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[10px]">↵</kbd> Open</span>
            <span class="inline-flex items-center gap-1"><kbd class="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[10px]">Esc</kbd> Close</span>
          </div>
          <span id="cmd-palette-count" class="font-medium">${ALL_TOOLS.length} tools</span>
        </div>
      </div>
    </div>
  `;
}

function createShortcutsModalHTML() {
  return `
    <div id="shortcuts-modal" class="cmd-palette-backdrop hidden" role="dialog" aria-modal="true" aria-labelledby="shortcuts-modal-title">
      <div class="cmd-palette-dialog !max-w-md">
        <div class="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              ${getIconSvg('keyboard', 'w-4 h-4')}
            </span>
            <h2 id="shortcuts-modal-title" class="text-sm font-bold text-zinc-900 dark:text-white">Keyboard Shortcuts</h2>
          </div>
          <button id="shortcuts-modal-close" type="button" aria-label="Close shortcuts" class="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
            ${getIconSvg('x', 'w-4 h-4')}
          </button>
        </div>
        <div class="p-5 space-y-3 text-xs">
          <div class="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800/70">
            <span class="text-zinc-600 dark:text-zinc-300">Open Global Tool Search</span>
            <div class="flex items-center gap-1">
              <kbd class="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[11px]">Ctrl+K</kbd>
              <span class="text-zinc-400">or</span>
              <kbd class="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[11px]">/</kbd>
            </div>
          </div>
          <div class="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800/70">
            <span class="text-zinc-600 dark:text-zinc-300">Navigate Search Results</span>
            <kbd class="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[11px]">↑ / ↓</kbd>
          </div>
          <div class="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800/70">
            <span class="text-zinc-600 dark:text-zinc-300">Launch Selected Tool</span>
            <kbd class="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[11px]">Enter</kbd>
          </div>
          <div class="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800/70">
            <span class="text-zinc-600 dark:text-zinc-300">Show / Hide Shortcuts</span>
            <kbd class="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[11px]">?</kbd>
          </div>
          <div class="flex items-center justify-between py-1.5">
            <span class="text-zinc-600 dark:text-zinc-300">Close Any Modal or Drawer</span>
            <kbd class="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[11px]">Esc</kbd>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCommandPaletteResults(query = '') {
  const resultsEl = document.getElementById('cmd-palette-results');
  const countEl = document.getElementById('cmd-palette-count');
  if (!resultsEl) return;

  const trimmed = query.trim();
  if (!trimmed) {
    // Show recents first if available, then featured tools
    const recents = getRecents().map(r => getToolByUrl(r.url)).filter(Boolean);
    const seen = new Set(recents.map(t => t.url));
    const defaults = ALL_TOOLS.filter(t => !seen.has(t.url)).slice(0, Math.max(0, 10 - recents.length));
    cmdCurrentMatches = [...recents, ...defaults];
  } else {
    cmdCurrentMatches = ALL_TOOLS
      .map(tool => ({ tool, score: fuzzyScore(trimmed, tool) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map(item => item.tool);
  }

  cmdSelectedIndex = 0;

  if (countEl) {
    countEl.textContent = trimmed
      ? `${cmdCurrentMatches.length} match${cmdCurrentMatches.length === 1 ? '' : 'es'}`
      : `${ALL_TOOLS.length} tools`;
  }

  if (cmdCurrentMatches.length === 0) {
    resultsEl.innerHTML = `
      <div class="py-10 text-center">
        <div class="w-11 h-11 mx-auto mb-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
          ${getIconSvg('search', 'w-5 h-5')}
        </div>
        <p class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">No tools matching "${escapeHtml(trimmed)}"</p>
        <p class="text-[11px] text-zinc-400 mt-1">Try keywords like PDF, compress, JSON, BMI, or QR code.</p>
      </div>
    `;
    return;
  }

  resultsEl.innerHTML = cmdCurrentMatches.map((tool, idx) => {
    const cat = CATEGORY_META[tool.category];
    const isActive = idx === cmdSelectedIndex;
    return `
      <a
        href="${tool.url}"
        role="option"
        aria-selected="${isActive ? 'true' : 'false'}"
        data-cmd-index="${idx}"
        class="cmd-palette-item flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
          isActive
            ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80'
            : 'hover:bg-zinc-100/80 dark:hover:bg-zinc-800/70 border border-transparent'
        }"
      >
        <span class="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${cat?.iconBg || 'bg-zinc-100 text-zinc-600'}">
          ${getIconSvg(tool.icon, 'w-4 h-4')}
        </span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-zinc-900 dark:text-white truncate">${escapeHtml(tool.title)}</span>
            <span class="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold border shrink-0 ${cat?.badgeClass || ''}">${escapeHtml(cat?.shortLabel || tool.category)}</span>
          </div>
          <p class="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">${escapeHtml(tool.description)}</p>
        </div>
        <span class="text-zinc-400 shrink-0">${getIconSvg('arrow-right', 'w-3.5 h-3.5')}</span>
      </a>
    `;
  }).join('');
}

function updateCommandPaletteSelection(newIndex) {
  const resultsEl = document.getElementById('cmd-palette-results');
  if (!resultsEl || cmdCurrentMatches.length === 0) return;

  const len = cmdCurrentMatches.length;
  cmdSelectedIndex = ((newIndex % len) + len) % len;

  resultsEl.querySelectorAll('.cmd-palette-item').forEach((item, idx) => {
    const active = idx === cmdSelectedIndex;
    item.setAttribute('aria-selected', active ? 'true' : 'false');
    if (active) {
      item.classList.add('bg-indigo-50', 'dark:bg-indigo-950/60', 'border-indigo-200/80', 'dark:border-indigo-800/80');
      item.classList.remove('border-transparent');
      item.scrollIntoView({ block: 'nearest' });
    } else {
      item.classList.remove('bg-indigo-50', 'dark:bg-indigo-950/60', 'border-indigo-200/80', 'dark:border-indigo-800/80');
      item.classList.add('border-transparent');
    }
  });
}

export function openCommandPalette(initialQuery = '') {
  const modal = document.getElementById('command-palette-modal');
  const input = document.getElementById('cmd-palette-input');
  if (!modal || !input) return;

  closeShortcutsModal();
  modal.classList.remove('hidden');
  cmdPaletteOpen = true;
  document.body.style.overflow = 'hidden';

  if (initialQuery) input.value = initialQuery;
  renderCommandPaletteResults(input.value);
  requestAnimationFrame(() => {
    input.focus();
    input.select();
  });
}

export function closeCommandPalette() {
  const modal = document.getElementById('command-palette-modal');
  if (!modal || modal.classList.contains('hidden')) return;
  modal.classList.add('hidden');
  cmdPaletteOpen = false;
  document.body.style.overflow = '';
}

function openShortcutsModal() {
  const modal = document.getElementById('shortcuts-modal');
  if (!modal) return;
  closeCommandPalette();
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeShortcutsModal() {
  const modal = document.getElementById('shortcuts-modal');
  if (!modal || modal.classList.contains('hidden')) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// =========================================================================
// Home Portal: Quick Access (Favorites & Recents) + Live Search & Filters
// =========================================================================
function renderQuickAccess() {
  const container = document.getElementById('quick-access-container');
  if (!container) return;

  const favs = getFavorites();
  const recents = getRecents();

  if (favs.length === 0 && recents.length === 0) {
    container.innerHTML = '';
    return;
  }

  let html = `<div class="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">`;

  if (favs.length > 0) {
    html += `
      <div class="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 backdrop-blur-xs">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-amber-500">${getIconSvg('star-filled', 'w-4 h-4')}</span>
          <h3 class="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">Your Pinned Favorites (${favs.length})</h3>
        </div>
        <div class="flex flex-wrap gap-2">
          ${favs.map(f => {
            const reg = getToolByUrl(f.url);
            const iconKey = reg?.icon || (f.icon && !/\p{Emoji}/u.test(f.icon) ? f.icon : 'sparkles');
            return `
              <a href="${escapeHtml(f.url)}" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 shadow-2xs border border-amber-500/20 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105 transition-all">
                <span class="text-amber-500 shrink-0">${getIconSvg(iconKey, 'w-3.5 h-3.5')}</span>
                <span>${escapeHtml(f.title)}</span>
              </a>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  if (recents.length > 0) {
    html += `
      <div class="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 backdrop-blur-xs">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-indigo-500">${getIconSvg('clock', 'w-4 h-4')}</span>
          <h3 class="text-[11px] font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">Recently Used</h3>
        </div>
        <div class="flex flex-wrap gap-2">
          ${recents.map(r => {
            const reg = getToolByUrl(r.url);
            const iconKey = reg?.icon || r.icon || 'zap';
            return `
              <a href="${escapeHtml(r.url)}" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 shadow-2xs border border-indigo-500/20 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105 transition-all">
                <span class="text-indigo-500 shrink-0">${getIconSvg(iconKey, 'w-3.5 h-3.5')}</span>
                <span>${escapeHtml(r.title)}</span>
              </a>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;
}

function initPortalFeatures() {
  const searchInput = document.getElementById('search-input');
  const mainContent = document.querySelector('main');
  if (!searchInput || !mainContent) return;

  // 1. Inject Filter Bar & Quick Access at the top of <main>
  if (!document.getElementById('portal-controls')) {
    const categoryPillsHTML = CATEGORIES.map(cat => `
      <button type="button" class="category-pill inline-flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-all" data-category="${cat.id}">
        ${getIconSvg(cat.icon, 'w-3.5 h-3.5 shrink-0')}
        <span>${escapeHtml(cat.shortLabel)} (${cat.count})</span>
      </button>
    `).join('');

    const filterHTML = `
      <div id="portal-controls" class="mb-10">
        <div id="quick-access-container"></div>

        <!-- Filter Tabs & Stats -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none" id="category-pills">
            <button type="button" class="category-pill active inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white shadow-xs cursor-pointer transition-all" data-category="all">
              ${getIconSvg('sparkles', 'w-3.5 h-3.5 shrink-0')}
              <span>All Tools (${ALL_TOOLS.length})</span>
            </button>
            ${categoryPillsHTML}
          </div>

          <div class="flex items-center justify-between sm:justify-end gap-2 px-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium shrink-0">
            <span id="tool-count-badge">Showing ${ALL_TOOLS.length} of ${ALL_TOOLS.length} tools</span>
          </div>
        </div>

        <!-- Empty State Container -->
        <div id="no-results-state" class="hidden text-center py-16 px-4 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 mt-6 shadow-xs">
          <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            ${getIconSvg('search', 'w-7 h-7')}
          </div>
          <h3 class="text-base font-bold text-zinc-900 dark:text-white mb-1">No matching tools found</h3>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-6">Try searching with a different term or clear the category filters.</p>
          <button type="button" id="reset-search-btn" class="btn-primary text-xs font-semibold px-4 py-2">
            Reset Filters
          </button>
        </div>
      </div>
    `;
    mainContent.insertAdjacentHTML('afterbegin', filterHTML);
  }

  // 2. Decorate each tool card with favorite button & category data
  const cards = document.querySelectorAll('.tool-card');
  const favs = getFavorites();

  cards.forEach(card => {
    const link = card.querySelector('a');
    if (!link) return;
    const url = link.getAttribute('href');
    const title = card.querySelector('h3')?.textContent.trim() || 'Tool';
    const isFav = favs.some(f => normalizePath(f.url) === normalizePath(url));

    let cat = 'utilities';
    if (url.includes('/pdf/')) cat = 'pdf';
    else if (url.includes('/images/')) cat = 'images';
    else if (url.includes('/calculators/')) cat = 'calculators';
    else if (url.includes('/seo/')) cat = 'seo';
    else if (url.includes('/finance/') || url.includes('/games/')) cat = 'finance-games';

    card.setAttribute('data-category', cat);
    card.setAttribute('data-title', title.toLowerCase());
    card.setAttribute('data-url', url);

    card.classList.add('relative', 'group');

    if (!card.querySelector('.card-fav-btn')) {
      const starBtn = document.createElement('button');
      starBtn.type = 'button';
      starBtn.className = 'card-fav-btn fav-star-btn absolute top-3.5 right-3.5 p-1.5 rounded-xl bg-zinc-100/90 dark:bg-zinc-800/90 shadow-2xs border border-zinc-200/80 dark:border-zinc-700/80 z-10 hover:scale-110 transition-transform cursor-pointer';
      starBtn.setAttribute('data-tool-url', url);
      starBtn.setAttribute('data-tool-title', title);
      starBtn.setAttribute('aria-label', `Bookmark ${title}`);
      starBtn.innerHTML = isFav
        ? getIconSvg('star-filled', 'w-3.5 h-3.5 text-amber-400')
        : getIconSvg('star', 'w-3.5 h-3.5 text-zinc-400 hover:text-amber-400');

      starBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite({ title, url });
      });

      card.appendChild(starBtn);
    }
  });

  // 3. Search & Filter State
  let activeCategory = 'all';

  function filterCards() {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    cards.forEach(card => {
      const title = card.getAttribute('data-title') || '';
      const text = card.textContent.toLowerCase();
      const cardCat = card.getAttribute('data-category');

      const matchesQuery = !query || title.includes(query) || text.includes(query);
      const matchesCategory = activeCategory === 'all' || cardCat === activeCategory;

      if (matchesQuery && matchesCategory) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    document.querySelectorAll('main section').forEach(sec => {
      if (sec.id === 'portal-controls' || sec.id === 'why-omnitools' || sec.id === 'platform-faq' || sec.dataset.persistent === 'true') return;
      const childCards = sec.querySelectorAll('.tool-card');
      if (childCards.length === 0) return;
      const hasVisible = Array.from(childCards).some(c => c.style.display !== 'none');
      sec.style.display = hasVisible ? 'block' : 'none';
    });

    const badge = document.getElementById('tool-count-badge');
    const emptyState = document.getElementById('no-results-state');

    if (badge) {
      badge.textContent = `Showing ${visibleCount} of ${cards.length} tools`;
    }

    if (emptyState) {
      emptyState.classList.toggle('hidden', visibleCount > 0);
    }
  }

  searchInput.addEventListener('input', filterCards);

  document.querySelectorAll('.category-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.category-pill').forEach(p => {
        p.classList.remove('active', 'bg-indigo-600', 'text-white', 'shadow-xs');
        p.classList.add('text-zinc-600', 'dark:text-zinc-400');
      });
      pill.classList.add('active', 'bg-indigo-600', 'text-white', 'shadow-xs');
      pill.classList.remove('text-zinc-600', 'dark:text-zinc-400');

      activeCategory = pill.getAttribute('data-category');
      filterCards();
    });
  });

  document.getElementById('reset-search-btn')?.addEventListener('click', () => {
    searchInput.value = '';
    const allPill = document.querySelector('.category-pill[data-category="all"]');
    allPill?.click();
  });

  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  const cat = params.get('cat');

  if (q) {
    searchInput.value = q;
  }
  if (cat) {
    const pill = document.querySelector(`.category-pill[data-category="${cat}"]`);
    if (pill) pill.click();
  } else if (q) {
    filterCards();
  }

  renderQuickAccess();
}

// =========================================================================
// Tool Page AEO & Engagement Injection (3-Step How It Works, FAQ Accordion, 4 Related Tools)
// =========================================================================
function injectToolPageAeoSection() {
  const path = normalizePath(window.location.pathname);
  if (!path.includes('/tools/')) return;
  if (document.getElementById('tool-aeo-section')) return;

  const mainEl = document.querySelector('main');
  if (!mainEl) return;

  const fallbackCat = path.includes('/pdf/')
    ? 'pdf'
    : path.includes('/images/')
      ? 'images'
      : path.includes('/calculators/')
        ? 'calculators'
        : path.includes('/seo/')
          ? 'seo'
          : path.includes('/finance/') || path.includes('/games/')
            ? 'finance-games'
            : 'utilities';

  const registryTool = getToolByUrl(path);
  const fallbackTitle = document.title ? document.title.split('—')[0].split('-')[0].trim() : 'OmniTools Utility';
  const catMeta = CATEGORY_META[registryTool?.category || fallbackCat] || CATEGORY_META.utilities;

  const tool = registryTool || {
    title: fallbackTitle,
    url: path,
    category: catMeta.id,
    categoryLabel: catMeta.name,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') || catMeta.description,
    howTo: PLATFORM_HOWTO,
    faqs: catMeta.faqs
  };

  const related = getRelatedTools(tool, 4);

  const howToCardsHTML = tool.howTo.map((step, idx) => `
    <div class="workspace-panel !p-5 flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-extrabold font-mono">
          0${idx + 1}
        </span>
        <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Step ${idx + 1}</span>
      </div>
      <h3 class="text-sm font-bold text-zinc-900 dark:text-white">${escapeHtml(step.name)}</h3>
      <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">${escapeHtml(step.text)}</p>
    </div>
  `).join('');

  const faqItemsHTML = tool.faqs.map((faq, idx) => `
    <details class="faq-accordion" ${idx === 0 ? 'open' : ''}>
      <summary>
        <span>${escapeHtml(faq.q)}</span>
        <span class="faq-chevron">${getIconSvg('chevron-down', 'w-4 h-4')}</span>
      </summary>
      <div class="faq-answer">
        <p>${escapeHtml(faq.a)}</p>
      </div>
    </details>
  `).join('');

  const relatedCardsHTML = related.map(rel => {
    const relCat = CATEGORY_META[rel.category] || CATEGORY_META.utilities;
    return `
      <a href="${rel.url}" class="tool-card !p-5 group">
        <div>
          <div class="flex items-center justify-between gap-3 mb-3.5">
            <span class="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${relCat.iconBg}">
              ${getIconSvg(rel.icon, 'w-5 h-5')}
            </span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${relCat.badgeClass}">
              ${escapeHtml(relCat.shortLabel)}
            </span>
          </div>
          <h3 class="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
            ${escapeHtml(rel.title)}
          </h3>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            ${escapeHtml(rel.description)}
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <span>Open Tool</span>
          <span class="group-hover:translate-x-1 transition-transform">${getIconSvg('arrow-right', 'w-3.5 h-3.5')}</span>
        </div>
      </a>
    `;
  }).join('');

  const sectionHTML = `
    <section id="tool-aeo-section" class="mt-14 pt-10 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-12">
      <!-- 3-Step How It Works -->
      <div id="tool-howto-section">
        <div class="flex items-center gap-2.5 mb-5">
          <span class="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
            ${getIconSvg('sparkles', 'w-4 h-4')}
          </span>
          <div>
            <h2 class="text-lg font-extrabold text-zinc-900 dark:text-white">How ${escapeHtml(tool.title)} Works</h2>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">3 quick steps — 100% private in your browser.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${howToCardsHTML}
        </div>
      </div>

      <!-- Interactive FAQ Accordion -->
      <div id="tool-faq-section">
        <div class="flex items-center gap-2.5 mb-5">
          <span class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            ${getIconSvg('help-circle', 'w-4 h-4')}
          </span>
          <div>
            <h2 class="text-lg font-extrabold text-zinc-900 dark:text-white">Frequently Asked Questions</h2>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">Privacy, compatibility, and workflow answers for ${escapeHtml(tool.title)}.</p>
          </div>
        </div>
        <div class="space-y-3">
          ${faqItemsHTML}
        </div>
      </div>

      <!-- Related Tools -->
      <div id="related-tools-section">
        <div class="flex items-center justify-between gap-4 mb-5">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 flex items-center justify-center shrink-0">
              ${getIconSvg('layers', 'w-4 h-4')}
            </span>
            <div>
              <h2 class="text-lg font-extrabold text-zinc-900 dark:text-white">Related Utilities</h2>
              <p class="text-xs text-zinc-500 dark:text-zinc-400">More client-side tools you might find useful.</p>
            </div>
          </div>
          <a href="${catMeta.anchor}" class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 shrink-0">
            <span>Browse All</span>
            ${getIconSvg('arrow-right', 'w-3.5 h-3.5')}
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          ${relatedCardsHTML}
        </div>
      </div>
    </section>
  `;

  mainEl.insertAdjacentHTML('beforeend', sectionHTML);
}

// =========================================================================
// Technical SEO & AEO Auto-Injector
// =========================================================================
function upsertMeta(attrName, attrValue, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href, extraAttrs = {}) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
  Object.entries(extraAttrs).forEach(([k, v]) => el.setAttribute(k, v));
}

function injectSeoAndAeo() {
  const origin = getOrigin();
  const path = normalizePath(window.location.pathname);
  const canonicalPath = path === '/' ? '/' : path;
  const canonicalUrl = `${origin}${canonicalPath}`;

  const tool = getToolByUrl(path);
  const catMeta = tool ? getCategoryById(tool.category) : null;

  const pageTitle = document.title || (tool ? `${tool.title} — ${SITE_CONFIG.siteName}` : SITE_CONFIG.siteName);
  const existingDesc = document.head.querySelector('meta[name="description"]')?.getAttribute('content');
  const pageDesc = existingDesc || tool?.description || `${SITE_CONFIG.siteName} — ${SITE_CONFIG.tagline}. 100% client-side with zero server uploads.`;
  const ogImageUrl = `${origin}${SITE_CONFIG.ogImage}`;

  // Canonical & PWA Manifest & Theme Color
  upsertLink('canonical', canonicalUrl);
  upsertLink('manifest', '/manifest.webmanifest');
  upsertMeta('name', 'theme-color', SITE_CONFIG.themeColor);

  if (!document.head.querySelector('meta[name="robots"]')) {
    const robotsVal = path.includes('under_maintenance') ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';
    upsertMeta('name', 'robots', robotsVal);
  }

  // OpenGraph
  upsertMeta('property', 'og:site_name', SITE_CONFIG.siteName);
  upsertMeta('property', 'og:title', pageTitle);
  upsertMeta('property', 'og:description', pageDesc);
  upsertMeta('property', 'og:url', canonicalUrl);
  upsertMeta('property', 'og:image', ogImageUrl);
  upsertMeta('property', 'og:type', 'website');

  // Twitter Card
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', pageTitle);
  upsertMeta('name', 'twitter:description', pageDesc);
  upsertMeta('name', 'twitter:image', ogImageUrl);

  // JSON-LD Structured Data (@graph)
  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${origin}/`
    }
  ];

  if (tool && catMeta) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: catMeta.name,
      item: `${origin}${catMeta.anchor}`
    });
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: tool.title,
      item: canonicalUrl
    });
  } else if (canonicalPath !== '/') {
    const cleanName = pageTitle.split('—')[0].split('-')[0].trim();
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: cleanName,
      item: canonicalUrl
    });
  }

  const howToSteps = (tool?.howTo || PLATFORM_HOWTO).map((step, idx) => ({
    '@type': 'HowToStep',
    position: idx + 1,
    name: step.name,
    text: step.text
  }));

  const faqList = (tool?.faqs || PLATFORM_FAQS).map(faq => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a
    }
  }));

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: `${origin}/`,
        name: SITE_CONFIG.siteName,
        description: SITE_CONFIG.tagline,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${origin}/?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: breadcrumbItems
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${canonicalUrl}#app`,
        name: tool ? tool.title : SITE_CONFIG.siteName,
        description: pageDesc,
        url: canonicalUrl,
        applicationCategory: tool?.applicationCategory || 'UtilitiesApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript in a modern browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        }
      },
      {
        '@type': 'HowTo',
        '@id': `${canonicalUrl}#howto`,
        name: tool ? `How to use ${tool.title}` : `How to use ${SITE_CONFIG.siteName}`,
        description: pageDesc,
        step: howToSteps
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: faqList
      }
    ]
  };

  let ldScript = document.getElementById('omnitools-jsonld');
  if (!ldScript) {
    ldScript = document.createElement('script');
    ldScript.type = 'application/ld+json';
    ldScript.id = 'omnitools-jsonld';
    document.head.appendChild(ldScript);
  }
  ldScript.textContent = JSON.stringify(jsonLdGraph);
}

// =========================================================================
// Service Worker Registration (Production Only)
// =========================================================================
function registerServiceWorker() {
  const isProd = typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.PROD
    : window.location.protocol === 'https:';

  if (isProd && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }
}

// =========================================================================
// Event Listeners
// =========================================================================
function setupEventListeners() {
  const menuBtn = document.getElementById('mobile-menu-trigger');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  const drawer = document.getElementById('mobile-drawer');

  function openDrawer() {
    backdrop?.classList.remove('opacity-0', 'pointer-events-none');
    backdrop?.classList.add('opacity-100');
    drawer?.classList.remove('-translate-x-full');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    backdrop?.classList.remove('opacity-100');
    backdrop?.classList.add('opacity-0', 'pointer-events-none');
    drawer?.classList.add('-translate-x-full');
    if (!cmdPaletteOpen) document.body.style.overflow = '';
  }

  menuBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  document.getElementById('drawer-search-trigger')?.addEventListener('click', () => {
    closeDrawer();
    openCommandPalette();
  });

  // Command Palette triggers & input
  document.getElementById('command-palette-trigger')?.addEventListener('click', () => openCommandPalette());
  document.getElementById('cmd-palette-close')?.addEventListener('click', closeCommandPalette);
  document.getElementById('command-palette-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'command-palette-modal') closeCommandPalette();
  });

  const cmdInput = document.getElementById('cmd-palette-input');
  cmdInput?.addEventListener('input', () => renderCommandPaletteResults(cmdInput.value));
  cmdInput?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      updateCommandPaletteSelection(cmdSelectedIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      updateCommandPaletteSelection(cmdSelectedIndex - 1);
    } else if (e.key === 'Enter') {
      if (cmdCurrentMatches.length > 0) {
        e.preventDefault();
        const target = cmdCurrentMatches[cmdSelectedIndex] || cmdCurrentMatches[0];
        if (target?.url) {
          closeCommandPalette();
          window.location.href = target.url;
        }
      }
    }
  });

  // Shortcuts Modal
  document.getElementById('shortcuts-help-btn')?.addEventListener('click', openShortcutsModal);
  document.getElementById('shortcuts-modal-close')?.addEventListener('click', closeShortcutsModal);
  document.getElementById('shortcuts-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'shortcuts-modal') closeShortcutsModal();
  });

  // Share / Copy Link button
  document.getElementById('share-tool-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('share-tool-btn');
    const url = window.location.href;
    let copied = false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        copied = document.execCommand('copy');
      } catch {
        copied = false;
      }
      ta.remove();
    }

    if (copied) {
      showToast('Link copied to clipboard!', 'check');
      if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = `${getIconSvg('check', 'w-3.5 h-3.5 text-emerald-500')} <span class="hidden sm:inline text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>`;
        setTimeout(() => {
          btn.innerHTML = original;
        }, 1800);
      }
    } else {
      showToast('Copy URL from your browser address bar.', 'share');
    }
  });

  // Global keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    const activeTag = document.activeElement?.tagName;
    const isTyping = activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT' || document.activeElement?.isContentEditable;

    if (e.key === 'Escape') {
      closeDrawer();
      closeCommandPalette();
      closeShortcutsModal();
      const searchInput = document.getElementById('search-input');
      if (searchInput && document.activeElement === searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.blur();
      }
      return;
    }

    // Ctrl+K or Cmd+K or "/" opens Global Command Palette
    if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !isTyping)) {
      e.preventDefault();
      if (cmdPaletteOpen) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
      return;
    }

    // "?" opens Shortcuts Modal
    if (e.key === '?' && !isTyping) {
      e.preventDefault();
      const shortcutsModal = document.getElementById('shortcuts-modal');
      if (shortcutsModal?.classList.contains('hidden')) {
        openShortcutsModal();
      } else {
        closeShortcutsModal();
      }
    }
  });

  // Dark mode toggles
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', toggleDarkMode);
  });

  // Tool page bookmark button
  document.querySelectorAll('#universal-breadcrumbs .fav-star-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-tool-url');
      const title = btn.getAttribute('data-tool-title');
      const added = toggleFavorite({ title, url });
      showToast(added ? `Bookmarked ${title}` : `Removed ${title} from bookmarks`, added ? 'star-filled' : 'star');
    });
  });
}

// =========================================================================
// Mount Layout
// =========================================================================
function mountLayout() {
  const legacyHeaders = document.querySelectorAll('header:not(#universal-header), .shadow-md.font-sans.tracking-wide');
  legacyHeaders.forEach(el => el.remove());

  const legacyFooters = document.querySelectorAll('footer:not(#universal-footer)');
  legacyFooters.forEach(el => el.remove());

  if (!document.getElementById('universal-header')) {
    document.body.insertAdjacentHTML('afterbegin', createHeaderHTML());
  }

  if (!document.getElementById('universal-breadcrumbs')) {
    const breadcrumbHTML = createBreadcrumbsHTML();
    if (breadcrumbHTML) {
      document.getElementById('universal-header')?.insertAdjacentHTML('afterend', breadcrumbHTML);
    }
  }

  injectToolPageAeoSection();

  if (!document.getElementById('universal-footer')) {
    document.body.insertAdjacentHTML('beforeend', createFooterHTML());
  }

  if (!document.getElementById('mobile-drawer')) {
    document.body.insertAdjacentHTML('beforeend', createMobileDrawerHTML());
  }

  if (!document.getElementById('command-palette-modal')) {
    document.body.insertAdjacentHTML('beforeend', createCommandPaletteHTML());
  }

  if (!document.getElementById('shortcuts-modal')) {
    document.body.insertAdjacentHTML('beforeend', createShortcutsModalHTML());
  }

  injectSeoAndAeo();
  recordCurrentRecent();
  initPortalFeatures();
  setupEventListeners();
  registerServiceWorker();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountLayout);
} else {
  mountLayout();
}
