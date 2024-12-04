// user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../models/user.schema';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service'; // If you're using AuthService in UserService

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Register the model here
  ],
  providers: [UserService],
  exports: [UserService], // Export UserService so that it's available in other modules
})
export class UserModule {}
