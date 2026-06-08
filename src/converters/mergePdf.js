// Merge multiple PDFs into one using pdf-lib
import { PDFDocument } from 'pdf-lib';

/**
 * @param {File[]} files  - Array of PDF files
 * @param {Function} onProgress
 * @returns {Promise<Blob>}
 */
export async function mergePdfs(files, onProgress = () => {}) {
  if (files.length < 2) throw new Error('Please provide at least 2 PDF files to merge.');

  const merged = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const arrayBuffer = await files[i].arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(p => merged.addPage(p));
    onProgress(Math.round(((i + 1) / files.length) * 90));
  }

  const bytes = await merged.save();
  onProgress(100);
  return new Blob([bytes], { type: 'application/pdf' });
}
