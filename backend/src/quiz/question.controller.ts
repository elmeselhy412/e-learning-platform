// question.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { QuestionService } from './question.service';
import { UserPerformanceDto } from '../dto/user-performance.dto';  // Assuming the user performance DTO
import { Question } from '../models/question.schema';  // Assuming the Question schema

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  // Endpoint to get a question based on difficulty
  @Get('difficulty/:difficulty')
  async getQuestionByDifficulty(@Param('difficulty') difficulty: string): Promise<Question> {
    return this.questionService.getQuestionByDifficulty(difficulty);
  }

  // Endpoint to adjust difficulty based on user performance
  @Post('adjust-difficulty')
  async adjustDifficulty(@Body() userPerformanceDto: UserPerformanceDto): Promise<string> {
    return this.questionService.adjustDifficulty(userPerformanceDto);
  }
}
