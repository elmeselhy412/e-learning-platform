// import { Module, OnApplicationBootstrap } from '@nestjs/common';
// import { BackupService } from './backup.service';
// import { BackupController } from './backup.controller';
// import { BackupScheduler } from './backup.scheduler';

// @Module({
//   controllers: [BackupController],
//   providers: [BackupService, BackupScheduler],
// })
// export class BackupModule implements OnApplicationBootstrap {
//   constructor(private readonly backupScheduler: BackupScheduler) {}

//   // Start the scheduled backup on application bootstrap
//   onApplicationBootstrap() {
//     this.backupScheduler.scheduleBackup();
//   }
// }
