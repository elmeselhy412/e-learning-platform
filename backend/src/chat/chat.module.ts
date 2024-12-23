import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatSchema } from '../models/chat.schema';
import { ChatGateway } from './chat.gateway';
import { MessageService } from 'src/messages/message.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }])],
  controllers: [ChatController],
  providers: [ChatService, 
    ChatGateway, MessageService
  ],
})
export class ChatModule {}
