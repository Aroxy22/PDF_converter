// PDF compression using pdf-lib (re-serializes with compression flags)
import { PDFDocument } from 'pdf-lib';

/**
 * @param {File} file
 * @param {Object} opts - level ('low'|'medium'|'high')
 * @param {Function} onProgress
 * @returns {Promise<Blob>}
 */
export async function compressPdf(file, opts = {}, onProgress = () => {}) {
  const { level = 'medium' } = opts;

  onProgress(20);

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  onProgress(60);

  // pdf-lib saves with object streams enabled — this reduces file size
  const useObjectStreams = level !== 'low';
  const bytes = await pdf.save({ useObjectStreams });

  onProgress(100);

  const originalSize = arrayBuffer.byteLength;
  const newSize = bytes.byteLength;

  return {
    blob: new Blob([bytes], { type: 'application/pdf' }),
    originalSize,
    newSize,
    savings: Math.max(0, Math.round((1 - newSize / originalSize) * 100)),
  };
}

export function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
