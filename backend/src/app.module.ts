import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './courses/courses.module';
import { NotificationModule } from './Notifications/Notifications.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://localhost:27017/elearning-platform',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    CourseModule,
    AuthModule,
    UserModule,
    NotificationModule
  ],
})
export class AppModule {}
