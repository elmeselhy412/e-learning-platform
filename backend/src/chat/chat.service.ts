import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from '../models/chat.schema';

@Injectable()
export class ChatService {
    constructor(@InjectModel('Chat') private readonly chatModel: Model<Chat>) {}
  
    async createChat(createChatDto: { instructorId: string; topic: string }) {
      const { instructorId, topic } = createChatDto;
      const newChat = new this.chatModel({ instructorId, topic, messages: [] });
      return await newChat.save();
    }
  
    async sendMessage(data: { chatId: string; userId: string; content: string }) {
      const { chatId, userId, content } = data;
      const chat = await this.chatModel.findById(chatId);
      if (!chat) throw new Error('Chat not found');
  
      const newMessage = { userId, content, timestamp: new Date() };
      chat.messages.push(newMessage);
      await chat.save();
      return newMessage;
    }
  
    async getChatMessages(chatId: string) {
      const chat = await this.chatModel.findById(chatId).select('messages');
      if (!chat) throw new Error('Chat not found');
      return chat.messages;
    }
  }