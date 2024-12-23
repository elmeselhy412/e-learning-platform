import { Injectable, Logger } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import { BackupService } from './backup.service';

@Injectable()
export class BackupScheduler {
  private readonly logger = new Logger(BackupScheduler.name);
  private intervals: { [key: string]: number } = {
    daily: 24 * 60 * 60 * 1000, // 1 day
    weekly: 7 * 24 * 60 * 60 * 1000, // 1 week
    monthly: 30 * 24 * 60 * 60 * 1000, // 1 month (approx.)
  };
  private intervalId: NodeJS.Timeout | null = null;

  constructor(private readonly backupService: BackupService) {
    this.startScheduler(); // Initialize with the default schedule
  }

  private startScheduler(): void {
    const schedule = this.backupService.getSchedule();
    this.setSchedule(schedule);
  }

  setSchedule(schedule: 'daily' | 'weekly' | 'monthly'): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear previous interval
    }

    const intervalMs = this.intervals[schedule];
    this.logger.log(`Setting backup schedule to: ${schedule} (${intervalMs} ms)`);

    this.intervalId = setInterval(async () => {
      try {
        await this.backupService.backupDatabase();
        this.logger.log('Scheduled backup executed successfully.');
      } catch (error) {
        this.logger.error('Scheduled backup failed:', error.message);
      }
    }, intervalMs);
  }
}
