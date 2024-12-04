import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module'; // Import your other modules here
import { AuthModule } from './auth/auth.module'; // Import your Auth module here

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/elearning-platform'), 
    UserModule, // Your other modules
    AuthModule,
  ],
})
export class AppModule {}
