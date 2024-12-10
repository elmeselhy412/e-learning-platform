import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { FeedbackModule } from '../feedback/feedback.module'; // Import FeedbackModule

@Module({
  imports: [FeedbackModule], // Import the module that provides FeedbackService
  providers: [CertificateService],
  controllers: [CertificateController],
})
export class CertificateModule {}
