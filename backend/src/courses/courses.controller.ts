import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards, UseInterceptors, UploadedFiles, NotFoundException, Req } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../dto/create-user.dto';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import path from 'path';

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

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR) 
  async updateCourse(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.updateCourse(id, updateCourseDto);
  }


  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async deleteCourse(@Param('id') id: string) {
    return this.coursesService.deleteCourse(id);
  }
  @Post(':courseId/upload-media')
  @UseInterceptors(FilesInterceptor('files', 10, { dest: './uploads/courses' })) // Limit files and set destination
  async uploadMedia(
    @Param('courseId') courseId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any, // To access the logged-in user (instructor) from the request
  ) {
    // Check if files are uploaded
    if (!files || files.length === 0) {
      throw new NotFoundException('No files uploaded');
    }

    // Get the logged-in instructor ID from the request
    const loggedInInstructorId = req.user.id;

    // Map file paths to store in the database
    const mediaPaths = files.map((file) => `/uploads/courses/${file.filename}`);

    // Call the service to append media to the course
    return this.coursesService.addMediaToCourse(courseId, loggedInInstructorId, mediaPaths);
  }

}
