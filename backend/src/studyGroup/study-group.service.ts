import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudyGroup, StudyGroupSchema } from '../models/study-group.schema';

@Injectable()
export class StudyGroupService {
  constructor(@InjectModel(StudyGroup.name) private studyGroupModel: Model<StudyGroup>) {}

  async createGroup(name: string, description: string): Promise<StudyGroup> {
    const newGroup = new this.studyGroupModel({ name, description });
    return newGroup.save();
  }

  async joinGroup(groupId: string, userId: string): Promise<StudyGroup> {
    const group = await this.studyGroupModel.findById(groupId);
    if (!group.members.includes(userId)) {
      group.members.push(userId);
    }
    return group.save();
  }

  async getAllGroups(): Promise<StudyGroup[]> {
    return this.studyGroupModel.find();
  }
}