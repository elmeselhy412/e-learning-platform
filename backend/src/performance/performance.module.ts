import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Progress, ProgressSchema } from '../models/progress.schema';
import { PerformanceService } from './performance.service';
import { PerformanceController } from './performance.controller';
import { AnalyticsService } from './analytics.service'; // Import AnalyticsService

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema }]), // Register ProgressModel
  ],
  providers: [PerformanceService, AnalyticsService], // Include AnalyticsService as a provider
  controllers: [PerformanceController],
  exports: [MongooseModule, PerformanceService], // Export PerformanceService for use in other modules
})
export class PerformanceModule {}
