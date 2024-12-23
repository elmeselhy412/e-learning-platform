// src/notification/notification.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from '../models/Notification.schema';
import { NotificationService } from './Notifications.service';
import { NotificationController } from './Notifications.controller';
import { Broadcast, BroadcastSchema } from 'src/models/broadcast.schema';
import { BroadcastService } from 'src/broadcast/broadcast.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema },{name: Broadcast.name, schema: BroadcastSchema}
    ], ),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, BroadcastService],
})
export class NotificationModule {}
