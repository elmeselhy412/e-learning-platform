import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BackupService } from './backup.service';

@Injectable()
export class BackupScheduler {
  constructor(private readonly backupService: BackupService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Schedule the backup at 2:00 AM daily
  async handleScheduledBackup(): Promise<void> {
    console.log('Scheduled backup started...');
    try {
      await this.backupService.backupDatabase();
      console.log('Scheduled backup completed successfully.');
    } catch (error) {
      console.error('Scheduled backup failed:', error.message);
    }
  }
}
