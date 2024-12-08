import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module'; // Import your other modules here
import { AuthModule } from './auth/auth.module'; // Import your Auth module here
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from './chat/chat.gateway';
import { MessageService } from './messages/message.service';
import { PerformanceModule } from './performance/performance.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/elearning-platform'), 
    UserModule, // Your other modules
    AuthModule,
    ChatModule,
    PerformanceModule
  ],
  providers: [
    ChatGateway,
    MessageService
    ]
})

export class AppModule {}
