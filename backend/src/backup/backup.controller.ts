import { Controller, Post, Get, Res, HttpStatus, Body } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupScheduler } from './backup.scheduler';
import { Response } from 'express';

@Controller('backup')
export class BackupController {
  constructor(
    private readonly backupService: BackupService,
    private readonly backupScheduler: BackupScheduler
  ) {}

  @Post('/trigger')
  async triggerBackup(@Res() res: Response): Promise<Response> {
    try {
      await this.backupService.backupDatabase();
      return res.status(HttpStatus.OK).json({ message: 'Backup triggered successfully.' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Backup failed.', error: error.message });
    }
  }

  @Post('/schedule')
  async setSchedule(
    @Body('schedule') schedule: 'daily' | 'weekly' | 'monthly',
    @Res() res: Response
  ): Promise<Response> {
    try {
      this.backupService.setSchedule(schedule);
      this.backupScheduler.setSchedule(schedule);
      return res.status(HttpStatus.OK).json({ message: `Backup schedule set to ${schedule}` });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to set backup schedule.', error: error.message });
    }
  }

  @Get('/list')
  async listBackups(@Res() res: Response): Promise<Response> {
    try {
      const backups = await this.backupService.listBackups();
      return res.status(HttpStatus.OK).json(backups);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to list backups.', error: error.message });
    }
  }
}
