import { encryptPDF } from '@pdfsmaller/pdf-encrypt';
import { PDFDocument } from 'pdf-lib';

export async function protectPdf(file, password, updateProgress) {
  updateProgress(10);
  
  const arrayBuffer = await file.arrayBuffer();
  
  // Parse and save without object streams to prevent text corruption during encryption
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const cleanBytes = await pdfDoc.save({ useObjectStreams: false });
  
  updateProgress(40);
  
  try {
    // Encrypt the PDF with RC4 (more compatible, prevents text dropping issues)
    const encryptedBytes = await encryptPDF(cleanBytes, password, {
      algorithm: 'RC4'
    });
    
    updateProgress(90);
    
    const blob = new Blob([encryptedBytes], { type: 'application/pdf' });
    updateProgress(100);
    
    return blob;
  } catch (err) {
    console.error("Encryption error:", err);
    throw new Error("Failed to protect PDF. Make sure the file is valid and not already protected.");
  }
}
