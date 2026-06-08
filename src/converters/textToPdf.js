// Plain text (.txt) to PDF
import { jsPDF } from 'jspdf';

/**
 * @param {File} file
 * @param {Object} opts - pageSize, fontSize, fontFamily, lineSpacing, margin
 * @param {Function} onProgress
 * @returns {Promise<Blob>}
 */
export async function textToPdf(file, opts = {}, onProgress = () => {}) {
  const {
    pageSize = 'a4',
    fontSize = 11,
    fontFamily = 'courier',
    lineSpacing = 1.5,
    margin = 20,
  } = opts;

  onProgress(20);

  const text = await file.text();
  const lines = text.split('\n');

  const PAGE_SIZES = {
    a4: [210, 297],
    letter: [215.9, 279.4],
    legal: [215.9, 355.6],
  };
  const [pw, ph] = PAGE_SIZES[pageSize] || PAGE_SIZES.a4;

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: pageSize });
  const maxW = pw - margin * 2;
  const lineH = (fontSize * 0.352778) * lineSpacing; // px to mm × spacing

  pdf.setFont(fontFamily === 'courier' ? 'courier' : 'helvetica', 'normal');
  pdf.setFontSize(fontSize);

  let y = margin;
  let pageCount = 0;

  for (let i = 0; i < lines.length; i++) {
    if (pageCount === 0 && y === margin) {
      // first page already created
    }

    const wrapped = pdf.splitTextToSize(lines[i] || ' ', maxW);

    for (const wLine of wrapped) {
      if (y + lineH > ph - margin) {
        pdf.addPage();
        y = margin;
        pageCount++;
      }
      pdf.text(wLine, margin, y);
      y += lineH;
    }

    onProgress(Math.round(20 + (i / lines.length) * 75));
  }

  onProgress(100);
  return pdf.output('blob');
}
