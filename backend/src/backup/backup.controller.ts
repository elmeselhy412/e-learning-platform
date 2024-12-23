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
  @Get('/list')
  async listBackups(@Res() res: Response): Promise<Response> {
    try {
      const backups = await this.backupService.listBackups();
      return res.status(HttpStatus.OK).json(backups);
    } catch (error) {
      console.error('Error listing backups:', error.message); // Add this for debugging
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to list backups.', error: error.message });
    }
  }
  

}
