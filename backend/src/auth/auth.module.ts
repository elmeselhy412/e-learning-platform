import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';  // Optional: if you have AuthController
import { UserModule } from '../user/user.module';   // Import the UserModule for UserService

@Module({
  imports: [UserModule],  // Make sure UserModule is imported if AuthService depends on UserService
  providers: [AuthService],
  controllers: [AuthController],  // Optional: If you have AuthController
})
export class AuthModule {}
