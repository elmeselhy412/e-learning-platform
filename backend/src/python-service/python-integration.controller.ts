import { Controller, Post, Body } from '@nestjs/common';
import { PythonIntegrationService } from './python-integration.sevice';

@Controller('recommendations')
export class PythonIntegrationController {
  constructor(private readonly pythonService: PythonIntegrationService) {}

  @Post()
  async getRecommendations(@Body('userId') userId: string, @Body('topN') topN: number) {
    if (!userId) {
      throw new Error('userId is required');
    }
    return this.pythonService.getRecommendations(userId, topN || 5);
  }
}