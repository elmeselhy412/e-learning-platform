import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';  // Optional: if you have AuthController
import { UserModule } from '../user/user.module';   // Import the UserModule for UserService
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './JwtStrategy';
import { MongooseModule } from '@nestjs/mongoose';
import { FailedLogin, FailedLoginSchema } from 'src/models/failed-login.schema';

@Module({
  imports: [
    ConfigModule, // Ensure ConfigModule is imported
    MongooseModule.forFeature([{ name: FailedLogin.name, schema: FailedLoginSchema }]),
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '1h' },
    }),
    forwardRef(() => UserModule), // Use forwardRef to resolve circular dependency
  ], providers: [JwtStrategy, AuthService],
  controllers: [AuthController],  // Optional: If you have AuthController
  exports: [AuthService, JwtModule], // Export JwtModule if needed elsewhere

})
export class AuthModule { }
