import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { Feedback, FeedbackSchema } from '../models/feedback.schema';
import { Progress, ProgressSchema } from '../models/progress.schema';
import { CourseModule} from '../courses/courses.module'; // Import CourseModule

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Feedback.name, schema: FeedbackSchema },
      { name: Progress.name, schema: ProgressSchema },
    ]),
    CourseModule  , // Import CourseModule to provide CourseModel
  ],
  providers: [FeedbackService],
  controllers: [FeedbackController],
  exports: [FeedbackService], // Ensure FeedbackService is exported

})
export class FeedbackModule {}
