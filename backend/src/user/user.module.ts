import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from '../models/user.schema';
import { CourseModule } from '../courses/courses.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/JwtStrategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { FailedLogin, FailedLoginSchema } from '../models/failed-login.schema';
import { FailedLoginModule } from './failed.login.module';
import { LoginActivityLog, LoginActivityLogSchema } from 'src/models/LoginActivityLog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: FailedLogin.name, schema: FailedLoginSchema },
      { name: LoginActivityLog.name, schema: LoginActivityLogSchema }, 

    ]),
    FailedLoginModule,
    forwardRef(() => CourseModule),
        ConfigModule,
    JwtModule.register({
      secret: 'JWT_SECRET', // Replace with your secret
      signOptions: { expiresIn: '3h' },
    }),
    forwardRef(() => AuthModule), // Use forwardRef for AuthModule as well
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService, MongooseModule], // Ensure MongooseModule is exported if required
})
export class UserModule {}
