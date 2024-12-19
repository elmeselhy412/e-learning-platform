import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CertificateService {
  generateCertificate(userName: string, courseName: string, feedback: string | null = null): string {
    const directoryPath = path.join(__dirname, '../../certificates'); // Ensure the correct path
    const filePath = path.join(directoryPath, `${userName}_${courseName}_Certificate.pdf`);

    // Check if the directory exists, create it if not
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Certificate Content
    doc
      .fontSize(30)
      .text('Certificate of Completion', { align: 'center' })
      .moveDown();

    doc
      .fontSize(20)
      .text(`This certifies that`, { align: 'center' })
      .moveDown();

    doc
      .fontSize(25)
      .text(`${userName}`, { align: 'center', underline: true })
      .moveDown();

    doc
      .fontSize(20)
      .text(`has successfully completed the course:`, { align: 'center' })
      .moveDown();

    doc
      .fontSize(25)
      .text(`${courseName}`, { align: 'center', underline: true })
      .moveDown();

    doc
      .fontSize(15)
      .text(`Date of Completion: ${new Date().toLocaleDateString()}`, { align: 'center' })
      .moveDown();

    if (feedback) {
      doc
        .fontSize(15)
        .text(`Student Feedback: ${feedback}`, { align: 'center', underline: true })
        .moveDown();
    }

    doc.text('Congratulations!', { align: 'center' });

    doc.end();

    return filePath; // Return the generated file path
  }
}
