// src/notification/notification.controller.ts
import { Controller, Post, Get, Body } from '@nestjs/common';
import { NotificationService } from './Notifications.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async createAnnouncement(@Body('message') message: string) {
    return this.notificationService.createAnnouncement(message);
  }

  @Get()
  async getAnnouncements() {
    return this.notificationService.getAnnouncements();
  }
}
