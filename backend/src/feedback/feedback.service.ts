import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback } from '../models/feedback.schema';
import { Progress } from '../models/progress.schema';
import { Course } from 'src/models/course.schema';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private readonly feedbackModel: Model<Feedback>,
    @InjectModel(Progress.name) private readonly progressModel: Model<Progress>,
    @InjectModel(Course.name) private readonly courseModel: Model<Course>, // Inject CourseModel

  ) {}

  // Submit feedback after verifying course completion
  async submitFeedback(
    userId: string,
    courseId: string,
    feedback: string,
    isForFutureUpdates = false, // Optional flag
  ): Promise<Feedback> {
    const progress = await this.progressModel.findOne({ userId, courseId }).exec();
    if (!progress || progress.completionPercentage < 100) {
      throw new Error('Feedback can only be submitted after completing the course.');
    }
  
    return this.feedbackModel.create({ userId, courseId, feedback, isForFutureUpdates });
  }
  

  // Get feedback for a specific course-
  async getFeedbackForCourse(courseId: string): Promise<Feedback[]> {
    return this.feedbackModel.find({ courseId }).exec();
  }
  async getFeedbackForFutureUpdates(): Promise<Feedback[]> {
    return this.feedbackModel.find({ isForFutureUpdates: true }).sort({ createdAt: -1 }).exec();
  }
  

}
