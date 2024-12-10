import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';
import { BackupScheduler } from './backup.scheduler';

@Module({
  providers: [BackupService, BackupScheduler],
  controllers: [BackupController],
  exports: [BackupService],
})
export class BackupModule {}
