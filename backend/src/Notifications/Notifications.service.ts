// src/notification/notification.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../models/Notification.schema';
import { BroadcastService } from 'src/broadcast/broadcast.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    private broadcastService: BroadcastService, // Inject BroadcastService

  ) {}

  async createAnnouncement(message: string) {
    const announcement = new this.notificationModel({ message });
    await this.broadcastService.createBroadcast(
      'Announcement Created',
      `A new Announcement has been added to the platform.`,
      ['student', 'instructor', 'admin'], 
    );   
    return announcement.save();
  }

  async getAnnouncements() {
    const announcement = this.notificationModel.find().sort({ createdAt: -1 }).exec();
    return announcement;
  }
}
