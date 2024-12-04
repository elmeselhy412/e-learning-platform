// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module'; // Import UserModule here

@Module({
  imports: [UserModule], // Make sure to include UserModule here
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
