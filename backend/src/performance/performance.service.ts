import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress } from '../models/progress.schema';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectModel(Progress.name) private readonly progressModel: Model<Progress>,
  ) {}

  async updateProgress(userId: string, courseId: string, completionPercentage: number): Promise<Progress> {
    return this.progressModel.findOneAndUpdate(
      { userId, courseId },
      { $set: { completionPercentage } },
      { new: true, upsert: true },
    );
  }

  async getUserProgress(userId: string): Promise<Progress[]> {
    return this.progressModel.find({ userId }).exec();
  }

  async getCourseProgress(courseId: string): Promise<Progress[]> {
    return this.progressModel.find({ courseId }).exec();
  }
}
