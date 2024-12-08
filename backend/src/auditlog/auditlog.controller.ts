import { Controller, Get, Param, Query } from '@nestjs/common';
import { AuditLogService } from './auditlog.service';

@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async getAllLogs() {
    return this.auditLogService.getLogs();
  }

  @Get('user/:userId')
  async getLogsByUser(@Param('userId') userId: string) {
    return this.auditLogService.getLogsByUser(userId);
  }
}