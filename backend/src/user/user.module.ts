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

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  CourseModule,
  ConfigModule,
  JwtModule.register({
    secret: 'JWT_SECRET', // Use your hardcoded secret
    signOptions: { expiresIn: '3h' }, // Token expiration
  }),
  forwardRef(() => AuthModule)
],

  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
