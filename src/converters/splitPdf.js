// Split PDF — extract selected pages into individual PDFs
import { PDFDocument } from 'pdf-lib';

/**
 * Split a PDF into individual-page PDFs.
 * @param {File} file
 * @param {number[]|'all'} pages  - 1-based page numbers to extract (or 'all')
 * @param {'individual'|'range'} mode
 * @param {Function} onProgress
 * @returns {Promise<{blob: Blob, name: string}[]>}
 */
export async function splitPdf(file, pages = 'all', onProgress = () => {}) {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = srcPdf.getPageCount();

  const pageNums = pages === 'all'
    ? Array.from({ length: totalPages }, (_, i) => i + 1)
    : pages;

  const results = [];
  const baseName = file.name.replace(/\.pdf$/i, '');

  for (let idx = 0; idx < pageNums.length; idx++) {
    const pageNum = pageNums[idx];
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(srcPdf, [pageNum - 1]);
    newPdf.addPage(copiedPage);
    const bytes = await newPdf.save();
    results.push({
      blob: new Blob([bytes], { type: 'application/pdf' }),
      name: `${baseName}_page${pageNum}.pdf`,
    });
    onProgress(Math.round(((idx + 1) / pageNums.length) * 100));
  }

  return results;
}

/**
 * Get page count from a PDF file.
 */
export async function getPdfPageCount(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  return pdf.getPageCount();
}
