import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { SubmitAnswerDto } from '../dto/submit-answer.dto';
import { CreateQuizDto } from 'src/dto/create-quiz.dto';
import { UserPerformanceDto } from 'src/dto/user-performance.dto';


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

  @Get('question/:userId')
  async getQuestion(@Param('userId') userId: string, @Body() userPerformance: UserPerformanceDto) {
    // Adjust difficulty based on user's performance
    const difficulty = await this.quizService.adjustDifficulty(userPerformance);
    
    // Fetch the question with the adjusted difficulty
    const question = await this.quizService.getQuestionByDifficulty(difficulty);
    
    if (!question) {
      return { message: 'No question found for the selected difficulty' };
    }
    
    return { question };
  }
  @Post('adjust-difficulty')
  async adjustDifficulty(@Body() userPerformance: UserPerformanceDto): Promise<string> {
    return this.quizService.adjustDifficulty(userPerformance);
  }


}


