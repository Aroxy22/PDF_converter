// Image (JPG/PNG/WebP/GIF/BMP) to PDF converter
import { jsPDF } from 'jspdf';

/**
 * Convert one or more image files to a single PDF.
 * @param {File[]} files
 * @param {Object} opts  - pageSize, orientation, margin, quality
 * @param {Function} onProgress - (pct: number) => void
 * @returns {Promise<Blob>}
 */
export async function imageToPdf(files, opts = {}, onProgress = () => {}) {
  const {
    pageSize = 'a4',
    orientation = 'auto',
    margin = 10,
    fitMode = 'fit', // 'fit' | 'fill' | 'original'
  } = opts;

  const PAGE_SIZES = {
    a4: [210, 297],
    a3: [297, 420],
    letter: [215.9, 279.4],
    legal: [215.9, 355.6],
  };

  const [pw, ph] = PAGE_SIZES[pageSize] || PAGE_SIZES.a4;
  const m = Number(margin);

  let pdf = null;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const imgData = await readFileAsDataURL(file);
    const img = await loadImage(imgData);

    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    // Determine orientation
    let docOrient = orientation;
    if (orientation === 'auto') {
      docOrient = imgW > imgH ? 'landscape' : 'portrait';
    }

    const [docW, docH] = docOrient === 'landscape' ? [ph, pw] : [pw, ph];
    const availW = docW - m * 2;
    const availH = docH - m * 2;

    let drawW, drawH, drawX, drawY;

    if (fitMode === 'fill') {
      drawW = availW;
      drawH = availH;
      drawX = m;
      drawY = m;
    } else if (fitMode === 'original') {
      // mmPerPx = 25.4 / 96
      const scale = 25.4 / 96;
      drawW = Math.min(imgW * scale, availW);
      drawH = Math.min(imgH * scale, availH);
      drawX = m + (availW - drawW) / 2;
      drawY = m + (availH - drawH) / 2;
    } else {
      // fit (maintain aspect ratio)
      const scaleW = availW / imgW;
      const scaleH = availH / imgH;
      const scale = Math.min(scaleW, scaleH);
      drawW = imgW * scale;
      drawH = imgH * scale;
      drawX = m + (availW - drawW) / 2;
      drawY = m + (availH - drawH) / 2;
    }

    if (i === 0) {
      pdf = new jsPDF({ orientation: docOrient, unit: 'mm', format: pageSize });
    } else {
      pdf.addPage([docW, docH], docOrient);
    }

    const fmt = file.type === 'image/png' ? 'PNG' : 'JPEG';
    pdf.addImage(imgData, fmt, drawX, drawY, drawW, drawH, undefined, 'FAST');

    onProgress(Math.round(((i + 1) / files.length) * 100));
  }

  return pdf.output('blob');
}

// ---- helpers ----
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
