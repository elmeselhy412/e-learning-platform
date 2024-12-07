import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';

@Injectable()
export class CertificateService {
  generateCertificate(userName: string, courseName: string): string {
    const doc = new PDFDocument();
    const filePath = `certificates/${userName}_${courseName}.pdf`;
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Customize the certificate content
    doc
      .fontSize(30)
      .text('Certificate of Completion', { align: 'center' })
      .moveDown();
    doc
      .fontSize(20)
      .text(`This certifies that ${userName}`, { align: 'center' })
      .text(`has successfully completed the course:`, { align: 'center' })
      .moveDown();
    doc
      .fontSize(25)
      .text(`${courseName}`, { align: 'center', underline: true })
      .moveDown(2);

    doc.text('Congratulations!', { align: 'center' });

    doc.end();

    return filePath;
  }
}
