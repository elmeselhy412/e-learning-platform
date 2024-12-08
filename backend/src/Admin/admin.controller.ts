import { Controller, Get, Patch, Delete, Param,UseGuards, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/dto/create-user.dto';
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Get all courses
  @Get('courses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async viewAllCourses() {
    return this.adminService.getAllCourses();
  }

  // Archive a course by ID
  @Patch('courses/:courseId/archive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async archiveCourse(@Param('courseId') _id: string) {
    return this.adminService.archiveCourse(_id);
  }

  // Remove a course by ID
  @Delete('courses/:courseId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async removeCourse(@Param('courseId') _id: string) {
    return this.adminService.removeCourse(_id);
  }

  
  @Post('send-notification')
  async sendNotification(): Promise<string> {
    try {
      const title = 'Platform Maintenance';
      const message = 'The platform will be undergoing scheduled maintenance from 2 AM to 4 AM tomorrow.';
      await this.adminService.sendNotification(title, message);
      return 'Notification sent successfully';
    } catch (error) {
      this.adminService.logError(`Notification failed: ${error.message}`, error.stack);
      return 'Failed to send notification';
    }
  }

  @Post('announce-update')
  async announceUpdate(): Promise<string> {
    try {
      await this.adminService.announceUpdate();
      return 'Announcement sent successfully';
    } catch (error) {
      this.adminService.logError(`Announcement failed: ${error.message}`, error.stack);
      return 'Failed to send announcement';
    }
  }

  @Get('security/logs')
  getSecurityLogs(): string {
    return 'Security log details: [Failed login attempt on 2024-12-08 12:30 PM]';
  }
}