import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards, UseInterceptors, UploadedFiles, Req, NotFoundException, Query, HttpException, HttpStatus } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from '../dto/create-course.dto'; // Import DTO
import { Roles } from '../auth/roles.decorator'; // Import Roles Decorator
import { RolesGuard } from '../auth/roles.guard'; // Import RolesGuard
import { UserRole } from '../dto/create-user.dto'; // Import UserRole
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage, Multer } from 'multer'; // Ensure this import is added at the top
import { UserService } from 'src/user/user.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService,
        private readonly userService: UserService
    
  ) {}


  @Post('create')
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.createCourse(createCourseDto);
  }

  @Get('/')
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  // @Get(':id')
  // async getCourseById(@Param('id') id: string) {
  //   return this.coursesService.getCourseById(id);
  // }

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
  // @Put(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR) // Only Admins and Instructors can update courses
  // async updateCourse(@Param('id') id: string, @Body() createCourseDto: CreateCourseDto) {
  //   return this.coursesService.updateCourse(id, createCourseDto);
  // }


  // @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN) // Only Admins can delete courses
  // async deleteCourse(@Param('id') id: string) {
  //   return this.coursesService.deleteCourse(id);
  // }


  @Post('adjust-optimize')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR) // Restricted to Admins and Instructors
  async adjustAndOptimizeCourses(
    @Body('folderPath') folderPath: string,
    @Body('feedbackData') feedbackData: Record<string, any>,
    @Body('performanceData') performanceData: Record<string, any>,
  ) {
    return this.coursesService.adjustAndOptimizeCourses(folderPath, feedbackData, performanceData);
  }


  @Post(':courseId/upload-media')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/courses',
        filename: (req, file, callback) => {
          const extension = file.originalname.split('.').pop();
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filename = `${uniqueSuffix}.${extension}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadMedia(
    @Param('courseId') courseId: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: any,
  ) {
    // Validate uploaded files
    if (!files || files.length === 0) {
      throw new NotFoundException('No files uploaded.');
    }


    // Generate file paths for uploaded media
    const mediaPaths = files.map((file) => `/uploads/courses/${file.filename}`);

    // Call service to add media to the course
    return this.coursesService.addMediaToCourse(courseId, mediaPaths);
  }

 




  @Get('search-courses')
  async searchCourses(@Query('topic') topic?: string, @Query('instructor') instructor?: string) {
    try {
      const courses = await this.coursesService.searchCourses({ topic, instructor });
      return { courses };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get('enrolled-courses/:userId')
  async getEnrolledCourses(@Param('userId') userId: string) {
    // Fetch the user by ID
    const user = await this.userService.getUserById(userId);
  
    // If user not found, throw a NotFoundException
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Safeguard against undefined or invalid courses
    const enrolledCourses = Array.isArray(user.courses)
      ? user.courses.map((courseId: any) => courseId.toString())
      : [];
  
    // Return the enrolled courses as an array of strings
    return { courses: enrolledCourses };
  }
  

@Post('enroll')
async enrollStudent(@Body() { userId, courseId }: { userId: string; courseId: string }) {
  try {
    const result = await this.coursesService.enrollStudentInCourse(userId, courseId);
    return result;
  } catch (error) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
}

}