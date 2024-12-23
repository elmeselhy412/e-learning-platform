import { Controller, Post, Get, Res, HttpStatus } from '@nestjs/common';
import { BackupService } from './backup.service';
import { Response } from 'express';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('/trigger')
  async triggerBackup(@Res() res: Response): Promise<Response> {
    try {
      await this.backupService.backupDatabase();
      return res.status(HttpStatus.OK).json({ message: 'Backup triggered successfully.' });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Backup failed.', error: error.message });
    }
  }

  @Get('/status')
  async getBackupStatus(@Res() res: Response): Promise<Response> {
    // Optional: Implement logic to check the latest backup status
    return res.status(HttpStatus.OK).json({ message: 'Backup service is running.' });
  }
}
