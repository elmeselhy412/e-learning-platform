// src/user/user.controller.ts
import { Body, Controller, Post, Get, HttpException, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/create-user.dto'; // Import DTO for user registration
import { EnrollCourseDto } from '../dto/enroll-course.dto'; // Import DTO for course enrollment
import { SearchCoursesDto } from '../dto/search-course.dto'; // Import DTO for course searching
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Import JWT guard

@Controller('users') // Base path for user-related routes
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 1. Register a new user
  @Post('register') 
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.createUser(createUserDto);
      return { message: 'User registered successfully', user };
    } catch (error) {
      console.error('Error registering user:', error); // Log the actual error
      if (error.message === 'User already exists') {
        throw new HttpException(
          { message: 'User already exists' },
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          { message: 'Server error' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 3. Search for courses (Browsing)
  @Get('search-courses')
  async searchCourses(@Query() searchParams: SearchCoursesDto) {
    try {
      const courses = await this.userService.searchCourses(searchParams);
      return { courses };
    } catch (error) {
      console.error('Error searching courses:', error);
      throw new HttpException(
        { message: 'Server error while searching for courses' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 4. Enroll in a course
  @Post('enroll')
  @UseGuards(JwtAuthGuard) // Protect route with JWT authentication
  async enrollCourse(@Body() enrollCourseDto: EnrollCourseDto) {
    try {
      const enrollment = await this.userService.enrollCourse(enrollCourseDto);
      return { message: 'Enrolled successfully in the course', enrollment };
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw new HttpException(
        { message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
