// src/user/user.controller.ts
import { Body, Controller, Post, Get, HttpException, HttpStatus, UseGuards, Query, Put, Patch, Param, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserRole } from '../dto/create-user.dto'; // Import DTO for user registration
import { EnrollCourseDto } from '../dto/enroll-course.dto'; // Import DTO for course enrollment
import { SearchCoursesDto } from '../dto/search-course.dto'; // Import DTO for course searching
import { JwtStrategy } from '../auth/JwtStrategy'; // Import JWT guard
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';
import { UpdateProfileDto } from 'src/dto/update-profile.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { FailedLoginService } from './failed.login.service';
import{UpdateProfileByInstructorDto} from 'src/dto/update-profile-by-instructor.dto'
import { UpdateStatusDto } from 'src/dto/update-status.dto';

@Controller('users') // Base path for user-related routes
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly failedLoginService: FailedLoginService
    
  ) {}

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
  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    try {
      const result = await this.userService.login(loginDto.email, loginDto.password);
      return result;
    } catch (error) {
      console.error('Error during login:', error);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyDto: { email: string; otp: string }) {
    try {
      const result = await this.userService.verifyOtpAndLogin(verifyDto.email, verifyDto.otp);
      console.log(result);
      return {
        success: true,
        email: result.email,
        role: result.role, // Ensure `role` exists in your user entity
        userId: result.userId

      };    } catch (error) {
      console.error('Error during OTP verification:', error);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
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
  @Post('enroll') // Endpoint: users/enroll
  @UseGuards(JwtAuthGuard) // Protect route with JWT authentication
  async enrollCourse(@Body() enrollCourseDto: EnrollCourseDto) {
    try {
      const enrollment = await this.userService.enrollCourse(enrollCourseDto);
      return { message: 'Enrolled successfully in the course', enrollment };
    } catch (error) {
      console.error('Error enrolling in course:', error.message);
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST, // Use appropriate HTTP status code
      );
    }
  }
 @Patch(':id')
async updateUserProfile(
  @Param('id') id: string,
  @Body() updateProfileDto: UpdateProfileDto,
) {
  return this.userService.updateUserProfile(id, updateProfileDto);
}

@Patch('updateInstructor/:id')
async updateInstructorProfile(
  @Param('id') id: string,
  @Body() updateProfileByInstructorDto: UpdateProfileByInstructorDto,
) {
  const updatedUser = await this.userService.updateInstructorProfile(id, updateProfileByInstructorDto);
  return updatedUser; // Return the updated user object
}




  @Get('students')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllStudent() {
    try {
      const students = await this.userService.getAllStudents();
      return students;
    } catch (error) {
      console.log('Error retrieving students', error.message);
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Put('students/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateStudent(@Param('id') id: string, @Body() body) {
    try {
      const upd = this.userService.updateStudent(id, body);
    } catch (error) {
      console.log('Error updating student', error.message);
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Delete('students/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteStudent(@Param('id') id: string) {
    try {
      const upd = this.userService.deleteStudent(id);
    } catch (error) {
      console.log('Error deleting student', error.message);
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Get('instructors')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllInstructors() {
    try {
      const instructors = await this.userService.getAllInstructors();
      return instructors;
    } catch (error) {
      console.log('Error retrieving instructors', error.message);
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Put('instructors/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateInstructor(@Param('id') id: string, @Body() body) {
    console.log('ID:', id);
    console.log('Body:', body);
    try {
      const upd = await this.userService.updateInstructor(id, body);
      console.log('Updated User:', upd);
      return upd;
    } catch (error) {
      console.log('Error updating Instructor:', error.message);
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  
  @Delete('instructor/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteInstructor(@Param('id') id: string) {
    try {
      const upd = this.userService.deleteInstructor(id);
    } catch (error) {
      console.log('Error deleting instructor', error.message);
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('failed-logins')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getFailedLogins() {
    return this.failedLoginService.getFailedLogins();
  }
  @Get('instructor/:id')
  async getInstructorProfile(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    return {
      expertise: user.expertise || [],
      teachingInterests: user.teachingInterests || [],
    };
  }

  @Get('/getAll')
  async getAllusers(){
    return await this.userService.getAll();
  }
  
  @Patch('status/:id')
  async updateUserStatus(
    @Param('id') id: string,
    @Body() updateData: { status: 'active' | 'inactive' },
  ) {
    console.log('Received ID:', id); // Debug the ID
    console.log('Received Update Data:', updateData); // Debug the incoming body
  
    const updatedUser = await this.userService.updateUser(id, updateData);
    console.log('Updated User:', updatedUser); // Debug the updated user
  
    return updatedUser;
  }
  
  

}