import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PerformanceService } from './performance.service';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}
  @Post('/create')
  async createProgress(
    @Body()
    createDto: {
      userId: string; // Pass userId
      courseId: string; // Pass courseId
      completedModules?: string[];
      scores?: number[];
      completionPercentage?: number;
    },
  ) {
    const { userId, courseId, ...rest } = createDto;
    return await this.performanceService.createProgress(userId, courseId, rest);
  }

  @Post('/update')
  async updateProgress(@Body() updateDto: { userId: string; courseId: string; completionPercentage: number }) {
    return this.performanceService.updateProgress(updateDto.userId, updateDto.courseId, updateDto.completionPercentage);
  }

  @Post('/track-module')
  async trackModuleCompletion(
    @Body() moduleDto: { userId: string; courseId: string; moduleId: string },
  ) {
    return this.performanceService.trackModuleCompletion(
      moduleDto.userId,
      moduleDto.courseId,
      moduleDto.moduleId,
    );
  }

  @Post('/track-score')
  async trackQuizScore(@Body() scoreDto: { userId: string; courseId: string; score: number }) {
    return this.performanceService.trackQuizScore(
      scoreDto.userId,
      scoreDto.courseId,
      scoreDto.score,
    );
  }

  @Get('/user/:userId/completion-rate/:courseId')
  async getCompletionRate(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    const totalModules = 10; // Replace with dynamic module count if available
    return this.performanceService.calculateCompletionRate(userId, courseId, totalModules);
  }

  @Get('/user/:userId/average-score/:courseId')
  async getAverageScore(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.performanceService.calculateAverageScore(userId, courseId);
  }

  @Get('/user/:userId')
  async getUserProgress(@Param('userId') userId: string) {
    return this.performanceService.getUserProgress(userId);
  }

  @Get('/course/:courseId')
  async getCourseProgress(@Param('courseId') courseId: string) {
    return this.performanceService.getCourseProgress(courseId);
  }

  @Get('/course/:courseId/analysis')
async getCourseAnalysis(@Param('courseId') courseId: string) {
  return this.performanceService.getCourseAnalysis(courseId);
}

  
}
