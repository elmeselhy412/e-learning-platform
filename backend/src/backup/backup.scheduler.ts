// import { Injectable } from '@nestjs/common';
// import * as cron from 'node-cron';
// import { BackupService } from './backup.service';

// @Injectable()
// export class BackupScheduler {
//   constructor(private readonly backupService: BackupService) {}

//   // Schedule the backup to run every day at 2 AM
//   scheduleBackup() {
//     cron.schedule('0 2 * * *', async () => {
//       console.log('Starting scheduled backup...');
//       try {
//         await this.backupService.backupData();
//         console.log('Scheduled backup completed successfully.');
//       } catch (error) {
//         console.error('Error during scheduled backup:', error);
//       }
//     });
//   }
// }
