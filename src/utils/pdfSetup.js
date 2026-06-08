// Shared PDF.js worker setup
// Uses jsdelivr CDN with HARDCODED version 4.10.38 (matches exactly what's installed)
// CDN approach is more reliable than ?worker bundling which can have port/message issues
import * as pdfjsLib from 'pdfjs-dist';

let configured = false;

export function getPdfJs() {
  if (!configured) {
    // jsdelivr has every npm version — guaranteed to match the installed 4.10.38
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';
    configured = true;
  }
  return pdfjsLib;
}
