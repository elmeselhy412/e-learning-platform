import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudyGroupService } from './study-group.service';
import { StudyGroupController } from './study-group.controller';
import { StudyGroup, StudyGroupSchema } from '../models/study-group.schema';
import { User, UserSchema } from '../models/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudyGroup.name, schema: StudyGroupSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [StudyGroupController],
  providers: [StudyGroupService],
  exports: [StudyGroupService],
})
export class StudyGroupModule {}
