import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PerformanceModule } from './performance/performance.module';
import { FeedbackModule } from './feedback/feedback.module';
import { CertificateService } from './certificates/certificate.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://localhost:27017/elearning-platform',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
