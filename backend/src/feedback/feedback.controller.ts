import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('/submit')
  async submitFeedback(@Body() feedbackDto: { userId: string; courseId: string; feedback: string }) {
    return this.feedbackService.submitFeedback(feedbackDto.userId, feedbackDto.courseId, feedbackDto.feedback);
  }

  @Get('/course/:courseId')
  async getFeedbackForCourse(@Param('courseId') courseId: string) {
    return this.feedbackService.getFeedbackForCourse(courseId);
  }
}
