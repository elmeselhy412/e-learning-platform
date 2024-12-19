import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from '../models/auditlog.schema';

@Injectable()
export class AuditLogService {
  constructor(@InjectModel(AuditLog.name) private readonly auditLogModel: Model<AuditLogDocument>) {}

  async logAction(userId: string, action: string, details?: any): Promise<void> {
    const log = new this.auditLogModel({
      userId,
      action,
      details,
    });
    await log.save();
  }

  async getLogs(): Promise<AuditLog[]> {
    return this.auditLogModel.find().sort({ timestamp: -1 }).exec(); // Get logs in descending order of time
  }

  async getLogsByUser(userId: string): Promise<AuditLog[]> {
    return this.auditLogModel.find({ userId }).exec();
  }
}
