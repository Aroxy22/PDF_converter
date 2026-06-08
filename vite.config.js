import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures assets resolve relative to current dir, ideal for Vercel/Netlify/GitHub Pages
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('pdfjs-dist')) return 'vendor-pdfjs';
            if (id.includes('jspdf')) return 'vendor-jspdf';
            if (id.includes('pdf-lib')) return 'vendor-pdflib';
            if (id.includes('xlsx')) return 'vendor-xlsx';
            return 'vendor-core';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1200,
  }
});
