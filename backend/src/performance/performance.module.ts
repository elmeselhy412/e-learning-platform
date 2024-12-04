import { Module } from '@nestjs/common';
import { PerformanceService } from './performance.service.spec';


@Module({
  providers: [PerformanceService],
})
export class PerformanceModule {}
