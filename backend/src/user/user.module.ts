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
import { FailedLoginModule } from './failed.login.module'; // Import FailedLoginModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },
      { name: FailedLogin.name, schema: FailedLoginSchema }, // Register FailedLogin schema

    ]),
    FailedLoginModule,
    CourseModule, // Import CourseModule to resolve CourseModel dependency
    ConfigModule,
    JwtModule.register({
      secret: 'JWT_SECRET', // Replace with your secret
      signOptions: { expiresIn: '3h' },
    }),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
