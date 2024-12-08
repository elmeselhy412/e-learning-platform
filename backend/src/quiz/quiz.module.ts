// quiz.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionModule } from '../question/question.module';  // Import QuestionModule
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { Quiz, QuizSchema } from '../models/quiz.schema';
import { Question, QuestionSchema } from '../models/question.schema';  // Import Question schema here

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]),  // Add QuestionModel here
    QuestionModule,  // Import QuestionModule to resolve QuestionModel
  ],
  providers: [QuizService],
  controllers: [QuizController],
})
export class QuizModule {}
