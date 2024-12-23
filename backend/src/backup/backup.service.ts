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
  async listBackups(): Promise<{ id: string; timestamp: string; status: string }[]> {
    try {
      const backupFiles = fs.readdirSync(this.backupPath); // Read all directories in the backup path
  
      return backupFiles
        .filter((file) => file.startsWith('backup_')) // Only process folders starting with 'backup_'
        .map((file) => {
          // Extract timestamp from folder name using regex
          const timestampMatch = file.match(/backup_(\d{14})/); // Matches 14-digit timestamp
          const timestamp = timestampMatch ? timestampMatch[1] : null;
  
          if (!timestamp) {
            console.warn(`Invalid backup folder name: ${file}`);
            return null; // Skip invalid folder names
          }
  
          // Convert timestamp to a valid date string
          const date = new Date(
            parseInt(timestamp.substring(0, 4)), // Year
            parseInt(timestamp.substring(4, 6)) - 1, // Month (0-based)
            parseInt(timestamp.substring(6, 8)), // Day
            parseInt(timestamp.substring(8, 10)), // Hours
            parseInt(timestamp.substring(10, 12)), // Minutes
            parseInt(timestamp.substring(12, 14)) // Seconds
          );
  
          // Validate the date
          if (isNaN(date.getTime())) {
            console.warn(`Invalid timestamp in folder name: ${file}`);
            return null; // Skip invalid timestamps
          }
  
          return {
            id: file, // Use the folder name as the ID
            timestamp: date.toISOString(), // Convert to ISO string
            status: 'Completed', // Assuming all backups are completed
          };
        })
        .filter((backup) => backup !== null); // Filter out null entries
    } catch (error) {
      console.error('Error listing backups:', error.message);
      throw new Error('Failed to list backup files');
    }
  }
  
  
}
