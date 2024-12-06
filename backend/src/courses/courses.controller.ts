import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from '../dto/create-course.dto'; 
import { Roles } from '../auth/roles.decorator'; 
import { RolesGuard } from '../auth/roles.guard'; 
import { UserRole } from '../dto/create-user.dto'; 

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post('create')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR) 
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.createCourse(createCourseDto);
  }

  @Get()
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  @Get(':id')
  async getCourseById(@Param('id') id: string) {
    return this.coursesService.getCourseById(id);
  }

  @Get(':id/dashboard')
  async getCourseDashboard(@Param('id') id: string) {
    return this.coursesService.getCourseDashboard(id);
  }

  @Post(':id/notes')
  async createNote(
    @Param('id') courseId: string,
    @Body('content') content: string,
    @Body('userId') userId: string,
  ) {
    return this.coursesService.createNote(content, userId, courseId);
  }

  @Get(':id/notes')
  async getNotes(
    @Param('id') courseId: string,
    @Body('userId') userId: string,
  ) {
    return this.coursesService.getNotes(userId, courseId);
  }

  @Put('notes/:noteId')
  async updateNote(
    @Param('noteId') noteId: string,
    @Body('content') content: string,
  ) {
    return this.coursesService.updateNote(noteId, content);
  }

  @Delete('notes/:noteId')
  async deleteNote(
    @Param('noteId') noteId: string,
  ) {
    return this.coursesService.deleteNote(noteId);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR) 
  async updateCourse(@Param('id') id: string, @Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.updateCourse(id, createCourseDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) 
  async deleteCourse(@Param('id') id: string) {
    return this.coursesService.deleteCourse(id);
  }
}
