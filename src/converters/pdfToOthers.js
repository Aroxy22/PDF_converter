// PDF to Text (.txt) converter
import { getPdfJs } from '../utils/pdfSetup.js';

/**
 * Extract plain text from a PDF file.
 */
export async function pdfToTxt(file, onProgress = () => {}) {
  const pdfjsLib = getPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    fullText += `--- Page ${i} ---\n` + strings.join(' ') + '\n\n';
    onProgress(Math.round((i / numPages) * 100));
  }

  return new Blob([fullText], { type: 'text/plain;charset=utf-8' });
}
