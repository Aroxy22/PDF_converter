// PDF to Image converter using PDF.js
import { getPdfJs } from '../utils/pdfSetup.js';

/**
 * Convert each page of a PDF to an image blob.
 */
export async function pdfToImage(file, opts = {}, onProgress = () => {}) {
  const pdfjsLib = getPdfJs();
  const {
    format = 'jpeg',
    scale = 2,
    pages = 'all',
  } = opts;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;

  const pageNums = pages === 'all'
    ? Array.from({ length: totalPages }, (_, i) => i + 1)
    : pages;

  const results = [];

  for (let idx = 0; idx < pageNums.length; idx++) {
    const pageNum = pageNums[idx];
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;

    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const blob = await canvasToBlob(canvas, mimeType, 0.92);
    const baseName = file.name.replace(/\.pdf$/i, '');
    results.push({
      blob,
      name: `${baseName}_page${pageNum}.${format}`,
    });

    onProgress(Math.round(((idx + 1) / pageNums.length) * 100));
  }

  return results;
}

// Cache keyed by file name+size
const pdfCache = new Map();

async function getOrLoadPdf(file) {
  const pdfjsLib = getPdfJs();
  const key = `${file.name}__${file.size}`;
  if (pdfCache.has(key)) return pdfCache.get(key);

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  if (pdfCache.size >= 3) {
    pdfCache.delete(pdfCache.keys().next().value);
  }
  pdfCache.set(key, pdf);
  return pdf;
}

/**
 * Render a single PDF page to a canvas element (for previews/thumbnails).
 */
export async function renderPageToCanvas(file, pageNum = 1, scale = 1.5) {
  const pdf = await getOrLoadPdf(file);
  const pdfjsLib = getPdfJs();
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({ canvasContext: ctx, viewport }).promise;
  return { canvas, numPages: pdf.numPages };
}

function canvasToBlob(canvas, type, quality) {
  return new Promise(resolve => canvas.toBlob(resolve, type, quality));
}
