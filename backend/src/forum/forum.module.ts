import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { ForumSchema } from 'src/models/forum.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Forum', schema: ForumSchema }]),
UserModule],
  controllers: [ForumController],
  providers: [ForumService],
})
export class ForumModule {}
