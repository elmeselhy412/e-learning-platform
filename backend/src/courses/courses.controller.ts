import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from '../dto/create-course.dto'; // Import DTO
import { Roles } from '../auth/roles.decorator'; // Import Roles Decorator
import { RolesGuard } from '../auth/roles.guard'; // Import RolesGuard
import { UserRole } from '../dto/create-user.dto'; // Import UserRole
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // Create a new course (protected by role guard)
  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR) // Only Admins and Instructors can create courses
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.createCourse(createCourseDto);
  }

  // Get all courses (no restriction)
  @Get()
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  // Get a specific course by ID
  @Get(':id')
  async getCourseById(@Param('id') id: string) {
    return this.coursesService.getCourseById(id);
  }

  // Get the dashboard of a specific course
  @Get(':id/dashboard')
  async getCourseDashboard(@Param('id') id: string) {
    return this.coursesService.getCourseDashboard(id);
  }

  // Create a note for a specific course
  @Post(':id/notes')
  async createNote(
    @Param('id') courseId: string,
    @Body('content') content: string,
    @Body('userId') userId: string,
  ) {
    return this.coursesService.createNote(content, userId, courseId);
  }

  // Get notes for a specific course
  @Get(':id/notes')
  async getNotes(
    @Param('id') courseId: string,
    @Body('userId') userId: string,
  ) {
    return this.coursesService.getNotes(userId, courseId);
  }

  // Update a specific note by ID
  @Put('notes/:noteId')
  async updateNote(
    @Param('noteId') noteId: string,
    @Body('content') content: string,
  ) {
    return this.coursesService.updateNote(noteId, content);
  }

  // Delete a specific note by ID
  @Delete('notes/:noteId')
  async deleteNote(
    @Param('noteId') noteId: string,
  ) {
    return this.coursesService.deleteNote(noteId);
  }

  // Update a course by ID (protected by role guard)
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR) // Only Admins and Instructors can update courses
  async updateCourse(@Param('id') id: string, @Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.updateCourse(id, createCourseDto);
  }

  // Delete a course by ID (protected by role guard)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Only Admins can delete courses
  async deleteCourse(@Param('id') id: string) {
    return this.coursesService.deleteCourse(id);
  }
}
