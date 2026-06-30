import { decryptPDF } from '@pdfsmaller/pdf-decrypt';

export async function unlockPdf(file, password, updateProgress) {
  updateProgress(10);
  
  const arrayBuffer = await file.arrayBuffer();
  const pdfBytes = new Uint8Array(arrayBuffer);
  
  updateProgress(40);
  
  try {
    // Use pdf-decrypt to handle AES-256 and RC4 directly
    const decryptedBytes = await decryptPDF(pdfBytes, password);
    
    updateProgress(80);
    
    // Return decrypted bytes directly to avoid any parsing issues with pdf-lib
    const blob = new Blob([decryptedBytes], { type: 'application/pdf' });
    updateProgress(100);
    
    return blob;
  } catch (error) {
    console.error("Unlock error:", error);
    if (error.message && (error.message.toLowerCase().includes('password') || error.message.includes('encrypted'))) {
      throw new Error('Incorrect password or unsupported encryption type.');
    }
    throw new Error('Failed to unlock PDF. ' + error.message);
  }
}
