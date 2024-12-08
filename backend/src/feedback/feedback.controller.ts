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
    @Body() { userId, courseId, feedback }: { userId: string; courseId: string; feedback: string },
  ): Promise<Feedback> {
    const objectIdCourseId = new Types.ObjectId(courseId); // Convert to ObjectId
    console.log(`Converted courseId to ObjectId: ${objectIdCourseId}`);
    console.log(`Querying with userId: ${userId} and courseId: ${objectIdCourseId}`);
  
    const progress = await this.progressModel.findOne({ userId, courseId: objectIdCourseId }).exec();
    console.log(`Queried progress: ${JSON.stringify(progress)}`);
  
    if (!progress || progress.completionPercentage < 100) {
      throw new Error('Feedback can only be submitted after completing the course.');
    }
  
    // Save feedback
    return this.feedbackModel.create({ userId, courseId: objectIdCourseId, feedback });
  }

  @Get('/course/:courseId')
  async getFeedbackForCourse(@Param('courseId') courseId: string) {
    return this.feedbackService.getFeedbackForCourse(courseId);
  }
}
