import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve, relative } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

function getHtmlInputs(dir, baseDir = dir, fileList = {}) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const name = entry.name;
    if (
      name === 'node_modules' ||
      name === 'dist' ||
      name === '.planning' ||
      name === '.git'
    ) {
      continue;
    }
    const fullPath = resolve(dir, name);
    if (entry.isDirectory()) {
      getHtmlInputs(fullPath, baseDir, fileList);
    } else if (entry.isFile() && name.endsWith('.html')) {
      const relPath = relative(baseDir, fullPath).replace(/\\/g, '/');
      const key = relPath.replace(/\.html$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      fileList[key] = fullPath;
    }
  }
  return fileList;
}

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 3000,
    open: false
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: getHtmlInputs(__dirname)
    }
  }
});

