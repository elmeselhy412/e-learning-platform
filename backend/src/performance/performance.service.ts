import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress } from '../models/progress.schema';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectModel(Progress.name) private readonly progressModel: Model<Progress>,
  ) {}

  // Update or create progress record
  async updateProgress(userId: string, courseId: string, completionPercentage: number): Promise<Progress> {
    return this.progressModel.findOneAndUpdate(
      { userId, courseId },
      { $set: { completionPercentage } },
      { new: true, upsert: true },
    );
  }

  // Retrieve user progress
  async getUserProgress(userId: string): Promise<Progress[]> {
    return this.progressModel.find({ userId }).exec();
  }

  // Retrieve course progress
  async getCourseProgress(courseId: string): Promise<Progress[]> {
    return this.progressModel.find({ courseId }).exec();
  }

  // Track completed modules
  async trackModuleCompletion(userId: string, courseId: string, moduleId: string): Promise<Progress> {
    return this.progressModel.findOneAndUpdate(
      { userId, courseId },
      { $addToSet: { completedModules: moduleId } }, // Add moduleId to completedModules array
      { new: true, upsert: true },
    );
  }

  // Calculate course completion rate
  async calculateCompletionRate(userId: string, courseId: string, totalModules: number): Promise<number> {
    const progress = await this.progressModel.findOne({ userId, courseId }).exec();
    const completedModules = progress?.completedModules?.length || 0;
    return (completedModules / totalModules) * 100;
  }

  // Track and calculate quiz scores
  async trackQuizScore(userId: string, courseId: string, score: number): Promise<Progress> {
    const result = await this.progressModel.findOneAndUpdate(
      { userId, courseId },
      { $push: { scores: score } }, // Push the score into the scores array
      { new: true, upsert: true }, // Return the updated document, or create if not found
    ).exec();
  
    if (!result) {
      throw new Error('Failed to track quiz score');
    }
  
    return result;
  }
  
  

  async calculateAverageScore(userId: string, courseId: string): Promise<number> {
    const progress = await this.progressModel.findOne({ userId, courseId }).exec();
    const scores = progress?.scores || [];
    if (scores.length === 0) return 0;
    const total = scores.reduce((sum, score) => sum + score, 0);
    return total / scores.length;
  }
}
