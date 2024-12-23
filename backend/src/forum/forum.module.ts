import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { ForumSchema } from 'src/models/forum.schema';
import { UserModule } from 'src/user/user.module';
import { BroadcastService } from 'src/broadcast/broadcast.service';
import { Broadcast, BroadcastSchema } from 'src/models/broadcast.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Forum', schema: ForumSchema }, {name: Broadcast.name, schema: BroadcastSchema}
  ]),
UserModule],
  controllers: [ForumController],
  providers: [ForumService, BroadcastService],
})
export class ForumModule {}
