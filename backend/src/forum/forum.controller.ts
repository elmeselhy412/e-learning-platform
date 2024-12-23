import { Controller, Post, Get, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { ForumService } from './forum.service';

@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post('create')
  async createForum(@Body() createForumDto: any, @Res() res) {
    try {
      const forum = await this.forumService.createForum(createForumDto);
      return res.status(HttpStatus.CREATED).json(forum);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  @Post('message')
  async sendMessage(@Body() sendMessageDto: any, @Res() res) {
    try {
      const { forumId, userId, content } = sendMessageDto;

      if (!forumId || !userId || !content.trim()) {
        throw new Error('Invalid data: All fields are required.');
      }

      const message = await this.forumService.sendMessage(sendMessageDto);
      return res.status(HttpStatus.CREATED).json(message);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  @Get(':forumId/messages')
  async getMessages(@Param('forumId') forumId: string, @Res() res) {
    try {
      const forum = await this.forumService.getForumWithUserNames(forumId);
      if (!forum) throw new Error('Forum not found');
      return res.status(HttpStatus.OK).json(forum);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }

  }

  @Get()
  async getAllForums(@Res() res) {
    try {
      const forums = await this.forumService.getAllForums();
      return res.status(HttpStatus.OK).json(forums);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }
}
