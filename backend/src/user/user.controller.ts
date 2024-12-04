// src/user/user.controller.ts
import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/create-user.dto'; // Import DTO for user registration
import { LoginDto } from 'src/dto/login.dto';

@Controller('users') // Base path for user-related routes
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Register a new user
  @Post('register') // POST /users/register
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.createUser(createUserDto);
      return { message: 'User registered successfully', user };
    } catch (error) {
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

  // // Login and generate JWT token
  // @Post('login')
  // async login(@Body() body: LoginDto) {
  //   // Fetch user from DB by email (returns UserDocument)
  //   const user: UserDocument = await this.userService.findByEmail(body.email);
  //   if (!user) {
  //     return { error: 'User not found' };
  //   }

  //   // Compare provided password with the stored hashed password
  //   const isPasswordMatch = await this.authService.comparePasswords(body.password, user.passwordHash);
  //   if (isPasswordMatch) {
  //     // Generate and return JWT token
  //     const token = await this.authService.generateToken({ userId: user._id, role: user.role });
  //     return { token };
  //   }
  //   return { error: 'Invalid credentials' };
  // }


}
