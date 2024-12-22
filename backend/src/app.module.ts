import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './courses/courses.module';
import { NotificationModule } from './Notifications/Notifications.module';
import { StudyGroupModule } from './studyGroup/study-group.module';
import { MulterModule } from '@nestjs/platform-express';
import { AuditLogModule } from './auditlog/auditlog.module';
import { AdminModule } from './Admin/admin.module';
import { PythonIntegrationModule } from './python-service/python-integration.module';
import { FeedbackModule } from './feedback/feedback.module';
import { BackupModule } from './backup/backup.module';
import { ScheduleModule } from '@nestjs/schedule';
import { QuestionModule } from './question/question.module';
import { QuizModule } from './quiz/quiz.module';
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from './chat/chat.gateway';
import { MessageService } from './messages/message.service';
import { ForumModule } from './forum/forum.module';
import { PerformanceModule } from './performance/performance.module';

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
      dest: './uploads', 
    }),
    ScheduleModule.forRoot(), // Initialize the scheduling module
    CourseModule,
    AuthModule,
    UserModule,
    BackupModule,
    StudyGroupModule,
    NotificationModule,
    AuditLogModule,
    AdminModule,
    PythonIntegrationModule,
    FeedbackModule,
    QuestionModule,
    QuizModule,
    ChatModule,
    ChatGateway,    
    ForumModule,
    PerformanceModule
  ],
})
export class AppModule {}
