import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { QuestionService } from './question.service';
import { UserPerformanceDto } from '../dto/user-performance.dto'; 
import { Question } from '../models/question.schema';  

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('difficulty/:difficulty')
  async getQuestionByDifficulty(@Param('difficulty') difficulty: string): Promise<Question> {
    return this.questionService.getQuestionByDifficulty(difficulty);
  }

  @Post('adjust-difficulty')
  async adjustDifficulty(@Body() userPerformanceDto: UserPerformanceDto): Promise<string> {
    return this.questionService.adjustDifficulty(userPerformanceDto);
  }
}
