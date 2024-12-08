// import { Injectable } from '@nestjs/common';
// import { MongoClient } from 'mongodb';
// import { writeFileSync } from 'fs';
// import * as path from 'path';

// @Injectable()
// export class BackupService {
//   private uri: string = 'mongodb://localhost:27017'; // MongoDB URI
//   private client: MongoClient = new MongoClient(this.uri);

//   async backupData() {
//     try {
//       await this.client.connect();
//       const db = this.client.db('elearning');
//       const users = await db.collection('users').find().toArray();
//       const courses = await db.collection('courses').find().toArray();

//       const backupPath = path.join(__dirname, '../../backups', `backup_${new Date().toISOString()}.json`);
//       const backupData = { users, courses };

//       writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
//       console.log('Backup completed successfully:', backupPath);
//     } catch (error) {
//       console.error('Error during backup:', error);
//     } finally {
//       await this.client.close();
//     }
//   }
// }

