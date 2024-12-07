import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [ChatGateway],  // Register the gateway as a provider
})
export class ChatModule {}
