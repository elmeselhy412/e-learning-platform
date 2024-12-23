import { Controller, Post, Body } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { FeedbackService } from '../feedback/feedback.service';

@Controller('certificate')
export class CertificateController {
  constructor(
    private readonly certificateService: CertificateService,
    private readonly feedbackService: FeedbackService, // Inject FeedbackService
  ) {}

  @Post('/generate')
  async generateCertificate(
    @Body() certificateDto: { userName: string; courseName: string; feedback?: string },
  ) {
    const { userName, courseName, feedback } = certificateDto;

    // Generate the certificate
    const filePath = this.certificateService.generateCertificate(userName, courseName);

    // Save feedback if provided
    if (feedback) {
      await this.feedbackService.submitFeedback(userName, courseName, feedback);
    }

    return { message: 'Certificate generated successfully', filePath };
  }
}
