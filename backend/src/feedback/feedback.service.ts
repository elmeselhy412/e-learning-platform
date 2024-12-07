import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback } from '../models/feedback.schema';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private readonly feedbackModel: Model<Feedback>,
  ) {}

  async submitFeedback(userId: string, courseId: string, feedback: string): Promise<Feedback> {
    return this.feedbackModel.create({ userId, courseId, feedback });
  }

  async getFeedbackForCourse(courseId: string): Promise<Feedback[]> {
    return this.feedbackModel.find({ courseId }).exec();
  }
}
