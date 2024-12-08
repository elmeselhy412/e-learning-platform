import { Controller, Get, Patch, Delete, Param,UseGuards } from '@nestjs/common';
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
}