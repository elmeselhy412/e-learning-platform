import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLog, AuditLogSchema } from '../models/auditlog.schema';
import { AuditLogService } from './auditlog.service';
import { AuditLogController } from './auditlog.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AuditLog.name, schema: AuditLogSchema }]),
  ],
  providers: [AuditLogService],
  controllers: [AuditLogController],
  exports: [AuditLogService], // Export service to use it in middleware or other modules
})
export class AuditLogModule {}