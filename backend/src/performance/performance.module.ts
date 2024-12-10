import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Progress, ProgressSchema } from '../models/progress.schema';
import { PerformanceService } from './performance.service';
import { PerformanceController } from './performance.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema }]), // Register ProgressModel
  ],
  providers: [PerformanceService],
  controllers: [PerformanceController],
  exports: [MongooseModule], // Export MongooseModule to make ProgressModel available
})
export class PerformanceModule {}
