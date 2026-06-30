import { encryptPdf } from '@pdfsmaller/pdf-encrypt';
import { PDFDocument } from 'pdf-lib';
console.log('Exports:', encryptPdf ? 'encryptPdf found' : Object.keys(await import('@pdfsmaller/pdf-encrypt')));
