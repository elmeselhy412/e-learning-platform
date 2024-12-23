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
    CourseModule,
    AuthModule,
    UserModule,
    StudyGroupModule,
    NotificationModule,
    AuditLogModule,
    AdminModule,
    PythonIntegrationModule
    
  ],
})
export class AppModule {}
