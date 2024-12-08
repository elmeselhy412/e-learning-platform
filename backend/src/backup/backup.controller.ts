// import { Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
// import { BackupService } from './backup.service';

// @Controller('backup')
// export class BackupController {
//   constructor(private readonly backupService: BackupService) {}

//   @Post()
//   async createBackup() {
//     try {
//       await this.backupService.backupData();
//       return { message: 'Backup completed successfully.' };
//     } catch (error) {
//       throw new HttpException(
//         { message: 'Backup failed', error: error.message },
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }
// }
