import { Body,Controller,Get,NotFoundException,Param,Post,Patch,Query,Req,} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { SubmitAnswerDto } from '../dto/submit-answer.dto';
import { CreateQuizDto } from 'src/dto/create-quiz.dto';
import { UserPerformanceDto } from 'src/dto/user-performance.dto';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get(':quizId')
  async getQuizById(@Param('quizId') quizId: string) {
    return this.quizService.getQuizById(quizId);
  }

  @Patch(':quizId/update')
  async updateQuiz(
    @Param('quizId') quizId: string,
    @Body() updateQuizDto: Partial<CreateQuizDto>, // Accepting partial updates
  ) {
    return this.quizService.updateQuiz(quizId, updateQuizDto);
  }

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
  async getQuestion(
    @Param('userId') userId: string,
    @Body() userPerformance: UserPerformanceDto,
  ) {
    const difficulty = await this.quizService.adjustDifficulty(userPerformance);

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

  @Get('courses/:courseId/quizzes')
  async getQuizzesForCourse(@Param('courseId') courseId: string) {
    return await this.quizService.getQuizzesByModuleId(courseId);
  }
}
