import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

async function run() {
  try {
    const doc = await PDFDocument.create();
    doc.addPage();
    // Cannot encrypt with pdf-lib natively.
    console.log("pdf-lib is good for standard ops.");
  } catch (e) {
    console.error(e);
  }
}
run();
