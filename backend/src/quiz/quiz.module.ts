// quiz.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionModule } from '../question/question.module';  // Import QuestionModule
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { Quiz, QuizSchema } from '../models/quiz.schema';
import { Question, QuestionSchema } from '../models/question.schema';  // Import Question schema here
import { Broadcast, BroadcastSchema } from 'src/models/broadcast.schema';
import { BroadcastService } from 'src/broadcast/broadcast.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]),
    MongooseModule.forFeature([{name: Broadcast.name, schema: BroadcastSchema}]),
    QuestionModule,  // Import QuestionModule to resolve QuestionModel
  ],
  providers: [QuizService, BroadcastService],
  controllers: [QuizController],
})
export class QuizModule {}