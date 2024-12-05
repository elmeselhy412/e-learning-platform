import { Injectable, UnauthorizedException } from '@nestjs/common'; 
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as speakeasy from 'speakeasy';
import { User } from '../models/user.schema'; 
import { Course } from '../models/course.schema'; 
import { CreateUserDto } from 'src/dto/create-user.dto';
import { EnrollCourseDto } from 'src/dto/enroll-course.dto'; // DTO for course enrollment
import mongoose from 'mongoose'; // Import mongoose to use ObjectId
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class UserService {
private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: 'martinamaurice28@gmail.com',
      pass: 'crop nent zihp lylc'
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates
    },
  });
  
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Course.name) private courseModel: Model<Course>, // Injecting Course model
    private readonly authService: AuthService, // Inject AuthService
    private readonly jwtService: JwtService, // Inject JwtService

  ) {}

  // Fetch user by email
  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  // Compare provided password with stored hashed password
  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Create a new user
  async createUser(createUserDto: CreateUserDto) {
    const { password, role, name, email } = createUserDto;

    if (!password || !email || !role || !name) {
      throw new Error('Email and password are required');
    }

    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user object
    const newUser = new this.userModel({
      email,
      passwordHash: hashedPassword,
      role,
      name,
    });

    // Save the user
    try {
      await newUser.save();
      return { message: 'User registered successfully' };
    } catch (error) {
      console.error('Error registering user:', error);
      throw new Error('Error registering user');
    }
  }
  /////////login
  async sendOtpEmail(user: User, otp: string) {
    const mailOptions = {
      from: '"ELearningPlatform" <e-learning-platform@outlook.com>',
      to: user.email,
      subject: 'Your OTP for Login',
      text: `Your one-time password (OTP) is: ${otp}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('OTP email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Error sending email');
    }
  }

  generateOTP(): string {
    return speakeasy.totp({
      secret: 'otp-secret-key', // Use a consistent secret for OTPs
      encoding: 'base32',
    });
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const user = await this.findOneByEmail(email);
    if (!user || user.otp !== otp) {
      return false;
    }
    // Clear OTP after successful verification
    user.otp = null;
    await user.save();
    return true;
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordMatch = await this.comparePasswords(password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Incorrect password');
    }

      const generatedOTP = this.generateOTP();
      user.otp = generatedOTP;
      await user.save();
      await this.sendOtpEmail(user, generatedOTP);
      return { message: 'OTP sent to your email' };
   
  }

  async verifyOtpAndLogin(email: string, otp: string): Promise<any> {
    const isVerified = await this.verifyOTP(email, otp);
    if (!isVerified) {
      throw new UnauthorizedException('Invalid OTP');
    }

    const user = await this.findOneByEmail(email);
    const payload = { sub: user._id, role: user.role };
    const token = this.authService.generateToken(user);

    return { message: 'Login successful', token };
  }
  ////////end login
  
 
async enrollCourse(enrollCourseDto: EnrollCourseDto): Promise<User> {
  const { userId, courseId } = enrollCourseDto;

  // Convert courseId to ObjectId
  const courseObjectId = new mongoose.Types.ObjectId(courseId);

  // Fetch the user from the database
  const user = await this.userModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Fetch the course from the database
  const course = await this.courseModel.findById(courseObjectId);
  if (!course) {
    throw new Error('Course not found');
  }

  // Check if the user is already enrolled
  if (user.courses && user.courses.some((id) => id.toString() === courseObjectId.toString())) {
    throw new Error('User is already enrolled in this course');
  }

  // Enroll the user in the course
  user.courses.push(courseObjectId);
  await user.save();

  return user;
}
  


  // Example method for searching courses
  async searchCourses(searchParams: any): Promise<Course[]> {
    const { title, instructor } = searchParams;
    const query = {};

    if (title) {
      query['title'] = { $regex: title, $options: 'i' }; // Case-insensitive search
    }

    if (instructor) {
      query['instructor'] = { $regex: instructor, $options: 'i' };
    }

    return this.courseModel.find(query);
  }
}
