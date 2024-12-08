import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { SubmitAnswerDto } from '../dto/submit-answer.dto';
import { CreateQuizDto } from 'src/dto/create-quiz.dto';


@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // Get the next adaptive question
  @Get(':quizId/next-question')
  async getNextQuestion(
    @Param('quizId') _id: string,
    @Query('correctAnswers') correctAnswers: number,
    @Query('totalQuestions') totalQuestions: number,
  ) {
    return this.quizService.getNextQuestion(_id, { correctAnswers, totalQuestions });

  }
  @Post('create')
    async createQuiz(@Body() createQuizDto: CreateQuizDto) {
      return this.quizService.createQuiz(createQuizDto);
  }


}


