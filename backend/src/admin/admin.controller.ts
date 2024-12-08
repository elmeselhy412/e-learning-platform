import { Controller, Get, Patch, Delete, Param,UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RolesGuard } from '../auth/roles.guard';
@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Get all courses
  @Get('courses')
  async viewAllCourses() {
    return this.adminService.getAllCourses();
  }

  // Archive a course by ID
  @Patch('courses/:courseId/archive')
  async archiveCourse(@Param('courseId') _id: string) {
    return this.adminService.archiveCourse(_id);
  }

  // Remove a course by ID
  @Delete('courses/:courseId')
  async removeCourse(@Param('courseId') _id: string) {
    return this.adminService.removeCourse(_id);
  }
}
