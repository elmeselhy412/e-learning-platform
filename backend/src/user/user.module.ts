import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from '../models/user.schema';
import { CourseModule } from '../courses/courses.module'; // Import the CourseModule
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/JwtStrategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { FailedLoginService } from './failed.login.service';
import { FailedLogin, FailedLoginSchema } from '../models/failed-login.schema';


@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: FailedLogin.name, schema: FailedLoginSchema },
  ]),
    CourseModule,
    ConfigModule,
  JwtModule.register({
    secret: 'JWT_SECRET', // Use your hardcoded secret
    signOptions: { expiresIn: '3h' }, // Token expiration
  }),
  forwardRef(() => AuthModule)
  ],

  controllers: [UserController],
  providers: [UserService, JwtStrategy, FailedLoginService],
  exports: [UserService, FailedLoginService],
})
export class UserModule { }
