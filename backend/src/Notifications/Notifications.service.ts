// src/notification/notification.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../models/Notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ) {}

  async createAnnouncement(message: string) {
    const announcement = new this.notificationModel({ message });
    return announcement.save();
  }

  async getAnnouncements() {
    return this.notificationModel.find().sort({ createdAt: -1 }).exec();
  }
}
