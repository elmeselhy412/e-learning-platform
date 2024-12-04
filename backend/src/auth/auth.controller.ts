import { Body, Controller, Post, Res, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service'; // Assuming UserService handles DB operations
import { LoginDto } from '../dto/login.dto'; // DTO for login input

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService, // To handle user validation
  ) {}

  // Login endpoint to authenticate the user and generate a token
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res) {
    const { email, password } = loginDto;

    // Fetch user from the database using the userService
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Compare provided password with stored password (use bcrypt or other hashing methods)
    const isPasswordMatch = await this.userService.comparePasswords(password, user.passwordHash);
    if (!isPasswordMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Generate JWT token for the user
    const token = this.authService.generateToken({ userId: user._id, role: user.role });

    // Set token in cookies for further requests (optional)
    res.cookie('token', token, { httpOnly: true }); // Set the token in a secure, HTTP-only cookie

    // Return the token in the response
    return res.status(HttpStatus.OK).json({ message: 'Login successful', token });
  }

  // Authentication middleware (can also be moved to middleware folder if reusable)
  async authenticate(req, res, next) {
    const cookie = req.cookies;

    if (!cookie || !cookie.token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = this.authService.verifyToken(cookie.token);
      req.user = decoded.user; // Attach decoded user info to request object
      next(); // Proceed to next middleware/route handler
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  }
}
