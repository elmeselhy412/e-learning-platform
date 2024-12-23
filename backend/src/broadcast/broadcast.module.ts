import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BroadcastController } from './broadcast.controller';
import { BroadcastService } from './broadcast.service';
import { Broadcast, BroadcastSchema } from '../models/broadcast.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Broadcast.name, schema: BroadcastSchema }]),
  ],
  controllers: [BroadcastController],
  providers: [BroadcastService],
  exports: [BroadcastService],
})
export class BroadcastModule {}
