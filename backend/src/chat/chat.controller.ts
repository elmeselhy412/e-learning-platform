import { Controller, Post, Get, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create')
  async createChat(@Body() createChatDto: any, @Res() res) {
    try {
      const chat = await this.chatService.createChat(createChatDto);
      return res.status(HttpStatus.CREATED).json(chat);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  @Post('message')
  async sendMessage(@Body() sendMessageDto: any, @Res() res) {
    try {
      const message = await this.chatService.sendMessage(sendMessageDto);
      return res.status(HttpStatus.CREATED).json(message);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  @Get(':chatId/messages')
  async getMessages(@Param('chatId') chatId: string, @Res() res) {
    try {
      const messages = await this.chatService.getChatMessages(chatId);
      return res.status(HttpStatus.OK).json(messages);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }
}
