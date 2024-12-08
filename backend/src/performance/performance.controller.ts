import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PerformanceService } from './performance.service';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

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
  @Post('/track-engagement')
  async trackEngagement(
    @Body() body: { userId: string; courseId: string },
  ): Promise<void> {
    return this.performanceService.trackEngagement(body.userId, body.courseId);
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

  // New: Get engagement report for a course
  @Get('/course/:courseId/engagement-report')
  async getEngagementReport(@Param('courseId') courseId: string) {
    return this.performanceService.getEngagementReport(courseId);
  }

  // New: Get performance report for a course
  @Get('/course/:courseId/performance-report')
  async getPerformanceReport(@Param('courseId') courseId: string) {
    return this.performanceService.getPerformanceReport(courseId);
  }

  // New: Get insights for a course
  @Get('/course/:courseId/insights')
  async getCourseInsights(@Param('courseId') courseId: string) {
    return this.performanceService.getCourseInsights(courseId);
  }
}
