// Word (.docx) to PDF converter
// Uses mammoth.js to extract text, then jsPDF text functions — no html2canvas needed
import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';

/**
 * @param {File} file
 * @param {Object} opts - pageSize, margin
 * @param {Function} onProgress
 * @returns {Promise<Blob>}
 */
export async function wordToPdf(file, opts = {}, onProgress = () => {}) {
  const { pageSize = 'a4' } = opts;

  onProgress(10);

  const arrayBuffer = await file.arrayBuffer();

  // Get both HTML (for structure) and raw text
  const [htmlResult, textResult] = await Promise.all([
    mammoth.convertToHtml({ arrayBuffer }),
    mammoth.extractRawText({ arrayBuffer }),
  ]);

  onProgress(40);

  const PAGE_SIZES = {
    a4: [210, 297],
    letter: [215.9, 279.4],
    legal: [215.9, 355.6],
  };
  const [pw, ph] = PAGE_SIZES[pageSize] || PAGE_SIZES.a4;
  const marginMm = 20;
  const usableWidth = pw - marginMm * 2;

  const pdf = new jsPDF({ unit: 'mm', format: pageSize, orientation: 'portrait' });

  // Parse the HTML to get structured content with basic formatting
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlResult.value, 'text/html');
  const elements = doc.body.children;

  let y = marginMm;

  const addPage = () => {
    pdf.addPage();
    y = marginMm;
  };

  const checkPage = (lineHeight) => {
    if (y + lineHeight > ph - marginMm) addPage();
  };

  onProgress(60);

  for (const el of elements) {
    const tag = el.tagName.toLowerCase();
    const text = el.textContent.trim();
    if (!text) { y += 4; continue; }

    if (tag === 'h1') {
      checkPage(12);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(17, 17, 17);
      const lines = pdf.splitTextToSize(text, usableWidth);
      pdf.text(lines, marginMm, y);
      y += lines.length * 8 + 4;
    } else if (tag === 'h2') {
      checkPage(10);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(17, 17, 17);
      const lines = pdf.splitTextToSize(text, usableWidth);
      pdf.text(lines, marginMm, y);
      y += lines.length * 7 + 3;
    } else if (tag === 'h3') {
      checkPage(9);
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(17, 17, 17);
      const lines = pdf.splitTextToSize(text, usableWidth);
      pdf.text(lines, marginMm, y);
      y += lines.length * 6 + 3;
    } else if (tag === 'ul' || tag === 'ol') {
      const items = el.querySelectorAll('li');
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(34, 34, 34);
      items.forEach((li, i) => {
        const bullet = tag === 'ol' ? `${i + 1}. ` : '• ';
        const liText = bullet + li.textContent.trim();
        const lines = pdf.splitTextToSize(liText, usableWidth - 5);
        checkPage(lines.length * 5.5);
        pdf.text(lines, marginMm + 4, y);
        y += lines.length * 5.5 + 1.5;
      });
      y += 3;
    } else {
      // Paragraph / default
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(34, 34, 34);
      const lines = pdf.splitTextToSize(text, usableWidth);
      checkPage(lines.length * 5.5);
      pdf.text(lines, marginMm, y);
      y += lines.length * 5.5 + 3;
    }
  }

  // Fallback: if no content was added, use raw text
  if (y === marginMm) {
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    const lines = pdf.splitTextToSize(textResult.value, usableWidth);
    for (const line of lines) {
      checkPage(5.5);
      pdf.text(line, marginMm, y);
      y += 5.5;
    }
  }

  onProgress(100);
  return pdf.output('blob');
}
