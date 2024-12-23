import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress } from '../models/progress.schema';
import { Types } from 'mongoose';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectModel(Progress.name) private readonly progressModel: Model<Progress>,
  ) {}

  async createProgress(
    userId: string,
    courseId: string,
    initialData?: Partial<Progress>,
  ): Promise<Progress> {
    try {
      const progress = new this.progressModel({
        userId: new Types.ObjectId(userId), // Convert to ObjectId
        courseId: new Types.ObjectId(courseId), // Convert to ObjectId
        ...initialData,
      });

      return await progress.save();
    } catch (error) {
      console.error('Error creating progress:', error);
      throw new Error('Failed to create progress');
    }
  }
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

  
  async getCourseProgress(courseId: string): Promise<any[]> {
    const objectId = new Types.ObjectId(courseId);

    // Populate user information (e.g., names)
    return await this.progressModel
      .find({ courseId: objectId })
      .populate('userId', 'name') // Populate the `userId` field with `name` from the User model
      .exec();
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

  async getCourseAnalysis(courseId: string): Promise<any> {
    const objectId = new Types.ObjectId(courseId);
  
    // Fetch all progress records for the course
    const progressRecords = await this.progressModel.find({ courseId: objectId }).populate('userId', 'name').exec();
  
    // Analyze performance
    const analysis = progressRecords.map((record) => {
      const averageScore = record.scores.length
        ? record.scores.reduce((sum, score) => sum + score, 0) / record.scores.length
        : 0;
  
      return {
        studentId: record.userId, // Populated name from User model
        completionPercentage: record.completionPercentage || 0,
        averageScore: Math.round(averageScore),
        modulesCompleted: record.completedModules.length || 0,
      };
    });
  
    // Generate teaching insights (e.g., average class performance)
    const overallPerformance = {
      totalStudents: progressRecords.length,
      averageCompletion: Math.round(
        analysis.reduce((sum, record) => sum + record.completionPercentage, 0) / (analysis.length || 1)
      ),
      averageScore: Math.round(
        analysis.reduce((sum, record) => sum + record.averageScore, 0) / (analysis.length || 1)
      ),
    };
  
    return { analysis, overallPerformance };
  }
  
}
