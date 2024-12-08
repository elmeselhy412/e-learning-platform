import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PerformanceModule } from './performance/performance.module';
import { FeedbackModule } from './feedback/feedback.module';
import { QuizModule } from './quiz/quiz.module'; // Correctly import QuizModule
import { CourseModule } from './courses/courses.module';
import { AdminModule } from './admin/admin.module';
import { AuditLogModule } from './auditlog/auditlog.module';
import { PythonIntegrationModule } from './python-service/python-integration.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://localhost:27017/elearning-platform',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    MulterModule.register({
      dest: './uploads', // Ensure the uploads folder exists
    }),
    UserModule,
    AuthModule,
    PerformanceModule,
    FeedbackModule,
    QuizModule,
    CourseModule,
    AdminModule,
    AuditLogModule,
    PythonIntegrationModule

  ],
})
export class AppModule {}
