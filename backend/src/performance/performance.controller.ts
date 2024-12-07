import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PerformanceService } from './performance.service';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Post('/update')
  async updateProgress(@Body() updateDto: { userId: string; courseId: string; completionPercentage: number }) {
    return this.performanceService.updateProgress(updateDto.userId, updateDto.courseId, updateDto.completionPercentage);
  }

  @Get('/user/:userId')
  async getUserProgress(@Param('userId') userId: string) {
    return this.performanceService.getUserProgress(userId);
  }

  @Get('/course/:courseId')
  async getCourseProgress(@Param('courseId') courseId: string) {
    return this.performanceService.getCourseProgress(courseId);
  }
}
