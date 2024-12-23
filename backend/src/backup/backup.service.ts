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
  private currentSchedule: 'daily' | 'weekly' | 'monthly' = 'daily'; // Default schedule

  constructor() {
    // Ensure backup directory exists
    if (!fs.existsSync(this.backupPath)) {
      fs.mkdirSync(this.backupPath, { recursive: true });
    }
  }

  async backupDatabase(): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '');
    const backupDir = path.join(this.backupPath, `backup_${timestamp}`);

    const command = `mongodump --host ${this.dbHost} --port ${this.dbPort} --db ${this.dbName} --out ${backupDir}`;

    this.logger.log(`Starting backup: ${backupDir}`);

    return new Promise<void>((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          this.logger.error(`Backup failed: ${error.message}`);
          reject(error);
          return;
        }
        if (stderr) {
          this.logger.warn(`Backup warnings: ${stderr}`);
        }
        this.logger.log(`Backup successful: ${stdout}`);
        resolve();
      });
    });
  }

  async listBackups(): Promise<{ id: string; timestamp: string; status: string }[]> {
    try {
      const backupFiles = fs.readdirSync(this.backupPath);

      return backupFiles
        .filter((file) => file.startsWith('backup_'))
        .map((file) => {
          const timestampMatch = file.match(/backup_(\d{14})/);
          const timestamp = timestampMatch ? timestampMatch[1] : null;

          if (!timestamp) {
            this.logger.warn(`Invalid backup folder name: ${file}`);
            return null;
          }

          const date = new Date(
            parseInt(timestamp.substring(0, 4)),
            parseInt(timestamp.substring(4, 6)) - 1,
            parseInt(timestamp.substring(6, 8)),
            parseInt(timestamp.substring(8, 10)),
            parseInt(timestamp.substring(10, 12)),
            parseInt(timestamp.substring(12, 14))
          );

          if (isNaN(date.getTime())) {
            this.logger.warn(`Invalid timestamp in folder name: ${file}`);
            return null;
          }

          return {
            id: file,
            timestamp: date.toISOString(),
            status: 'Completed',
          };
        })
        .filter((backup) => backup !== null);
    } catch (error) {
      this.logger.error('Error listing backups:', error.message);
      throw new Error('Failed to list backup files');
    }
  }

  setSchedule(schedule: 'daily' | 'weekly' | 'monthly'): void {
    this.currentSchedule = schedule;
    this.logger.log(`Backup schedule updated to: ${schedule}`);
  }

  getSchedule(): 'daily' | 'weekly' | 'monthly' {
    return this.currentSchedule;
  }
}
