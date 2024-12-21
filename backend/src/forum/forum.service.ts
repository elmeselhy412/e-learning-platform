import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Forum } from '../models/forum.schema';
import { UserService } from '../user/user.service'; // Import UserService

@Injectable()
export class ForumService {
  constructor(
    @InjectModel('Forum') private readonly forumModel: Model<Forum>,
    private readonly userService: UserService, // Inject UserService
  ) {}

  async createForum(createForumDto: { instructorId: string; topic: string }) {
    const { instructorId, topic } = createForumDto;
    const newForum = new this.forumModel({ instructorId, topic, messages: [] });
    return await newForum.save();
  }

  async sendMessage(data: { forumId: string; userId: string; content: string }) {
    const { forumId, userId, content } = data;

    const forum = await this.forumModel.findById(forumId);
    if (!forum) throw new Error('Forum not found');

    const newMessage = { userId, content: content.trim(), timestamp: new Date() };
    forum.messages.push(newMessage);
    await forum.save();

    return newMessage;
  }

  async getForumMessages(forumId: string) {
    const forum = await this.forumModel.findById(forumId).select('messages');
    if (!forum) throw new Error('Forum not found');
    return forum.messages;
  }

  async getAllForums() {
    return await this.forumModel.find();
  }

  async getForumById(forumId: string) {
    return this.forumModel.findById(forumId);
  }

  
  async getForumWithUserNames(forumId: string) {
    const forum = await this.forumModel.findById(forumId);
    if (!forum) throw new Error('Forum not found');
  
    const messagesWithUserNames = await Promise.all(
      forum.messages.map(async (message) => {
        const user = await this.userService.getUserById(message.userId);
        console.log(user.name);
        return {
          userId: message.userId,
          content: message.content,
          timestamp: message.timestamp,
          userName: user.name, // Use user.name if user exists
        }
      })
    );
  
    return {
      topic: forum.topic,
      messages: messagesWithUserNames,
    };
  }
  
}
