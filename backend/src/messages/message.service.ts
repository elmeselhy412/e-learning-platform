import { Injectable } from '@nestjs/common';
import { MessageModel } from '../models/message.schema';

@Injectable()
export class MessageService {
  async saveMessage(data: {
    senderId: string;
    recipientId?: string;
    content: string;
  }) {
    const message = new MessageModel(data);
    return message.save();
  }

  async getMessages() {
    return MessageModel.find().sort({ timestamp: 1 }).exec();
  }
}
