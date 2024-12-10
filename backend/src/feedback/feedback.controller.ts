import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Progress } from 'src/models/progress.schema';
import { Course } from 'src/models/course.schema';
import { Feedback } from 'src/models/feedback.schema';


@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService, 
    @InjectModel(Progress.name) private readonly progressModel: Model<Progress>, 
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    @InjectModel(Feedback.name) private readonly feedbackModel:Model<Feedback>
  ) {}

  @Post('/submit')
  async submitFeedback(
    @Body()
    { userId, courseId, feedback, isForFutureUpdates }: 
    { userId: string; courseId: string; feedback: string; isForFutureUpdates?: boolean },
  ): Promise<Feedback> {
    return this.feedbackService.submitFeedback(userId, courseId, feedback, isForFutureUpdates || false);
  }
  

  @Get('/course/:courseId')
  async getFeedbackForCourse(@Param('courseId') courseId: string) {
    return this.feedbackService.getFeedbackForCourse(courseId);
  }
  @Get('future-updates')
  async getFutureUpdatesFeedback() {
    return await this.feedbackService.getFeedbackForFutureUpdates();
  }
} 

