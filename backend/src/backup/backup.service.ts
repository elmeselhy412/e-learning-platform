import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly backupPath = path.join(__dirname, '..', '..', 'backups'); // Backup directory
  private readonly dbName = 'elearning-platform'; // Replace with your database name
  private readonly dbHost = 'localhost'; // MongoDB host
  private readonly dbPort = 27017; // MongoDB port


  constructor() {
    // Ensure backup directory exists
    if (!fs.existsSync(this.backupPath)) {
      fs.mkdirSync(this.backupPath, { recursive: true });
    }
  }

  async backupDatabase(): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '');
    const backupDir = path.join(this.backupPath, `backup_${timestamp}`);

    // Construct mongodump command
    const command = `mongodump --host ${this.dbHost} --port ${this.dbPort} --db ${this.dbName} --out ${backupDir}`;

    this.logger.log(`Starting backup: ${backupDir}`);
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        this.logger.error(`Backup failed: ${error.message}`);
        return;
      }
      if (stderr) {
        this.logger.warn(`Backup warnings: ${stderr}`);
      }
      this.logger.log(`Backup successful: ${stdout}`);
    });
  }
}
