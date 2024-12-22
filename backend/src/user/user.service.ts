import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as speakeasy from 'speakeasy';
import { User, UserDocument } from '../models/user.schema'; // Adjust the path
import { Course, CourseDocument } from '../models/course.schema'; // Adjust the path
import { CreateUserDto } from 'src/dto/create-user.dto';
import { EnrollCourseDto } from 'src/dto/enroll-course.dto'; // DTO for course enrollment
import mongoose from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UpdateProfileDto } from 'src/dto/update-profile.dto';
import { FailedLogin } from '../models/failed-login.schema';
import { UpdateProfileByInstructorDto } from 'src/dto/update-profile-by-instructor.dto';


@Injectable()
export class UserService {
 
  private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: 'e.learning.platform121@gmail.com',
      pass: 'mdyl zbfb stgb ovbk',
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates
    },
  });

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(FailedLogin.name) private failedLoginModel: Model<FailedLogin>,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  // Fetch user by email
  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  // Compare provided password with stored hashed password
  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Create a new user
  async createUser(createUserDto: CreateUserDto) {
    const { passwordHash, role, name, email } = createUserDto;

    if (!passwordHash || !email || !role || !name) {
      throw new Error('Email, password, role, and name are required');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(passwordHash, saltRounds);

    const newUser = new this.userModel({
      email,
      passwordHash: hashedPassword,
      role,
      name,
    });

    try {
      await newUser.save();
      return { message: 'User registered successfully' };
    } catch (error) {
      console.error('Error registering user:', error);
      throw new Error('Error registering user');
    }
  }

  // Send OTP email
  async sendOtpEmail(user: UserDocument, otp: string) {
    const mailOptions = {
      from: '"ELearningPlatform" <e-learning-platform@outlook.com>',
      to: user.email,
      subject: 'Your OTP for Login',
      text: `Your one-time password (OTP) is: ${otp}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Error sending email');
    }
  }

  // Generate OTP
  generateOTP(): string {
    return speakeasy.totp({
      secret: 'otp-secret-key',
      encoding: 'base32',
    });
  }

  // Verify OTP
  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const user = await this.findOneByEmail(email);
    if (!user || user.otp !== otp) {
      // Log invalid OTP attempt to FailedLogin collection
      await new this.failedLoginModel({
        username: email,
        reason: 'Invalid OTP',
        timestamp: new Date(),
      }).save();
  
      return false; // Return false for invalid OTP
    }

    user.otp = null; // Clear OTP after successful verification
    await user.save();
    return true;
  }

  async login(email: string, password: string): Promise<any> {
    // Find the user by email
    const user = await this.findOneByEmail(email);
    if (!user) {
      // Log "User not found" in FailedLogin collection
      await new this.failedLoginModel({
        username: email,
        reason: 'User not found',
        timestamp: new Date(),
      }).save();
      throw new UnauthorizedException('User not found');
    }
  
    console.log('Password provided:', password); // Log provided password
    console.log('Password hash in DB:', user.passwordHash); // Log stored passwordHash
  
    // Compare the provided password with the hashed password
    const passwordMatch = await this.comparePasswords(password, user.passwordHash);
    if (!passwordMatch) {
      // Log "Invalid Password" in FailedLogin collection
      await new this.failedLoginModel({
        username: email,
        reason: 'Invalid Password',
        timestamp: new Date(),
      }).save();
      throw new UnauthorizedException('Incorrect password');
    }
  
    // Generate and send OTP
    const generatedOTP = this.generateOTP();
    user.otp = generatedOTP;
    await user.save();
    await this.sendOtpEmail(user, generatedOTP);
  
    return { message: 'OTP sent to your email' };
  }

  // Verify OTP and complete login
  async verifyOtpAndLogin(email: string, otp: string): Promise<any> {
    const isVerified = await this.verifyOTP(email, otp);
    if (!isVerified) {
      throw new UnauthorizedException('Invalid OTP');
    }
  
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    console.log('Retrieved User:', user); // Debug to verify user object
  
    const token = this.authService.generateToken(user);
  
    return {
      success: true,
      userId: user._id.toString(), // Convert ObjectId to string
      email: user.email,
      role: user.role,
      token:token,
    };
  }
  
  
    async getUserById(userId: string) {
      try {
        const user = await this.userModel.findById(userId).select('name');
        return user; // Ensure it returns the user document
      } catch (error) {
        console.error(`Error fetching user by ID: ${userId}`, error);
        return null; // Return null if the user isn't found or there's an error
      }
    }
    

  // Enroll in a course
  async enrollCourse(enrollCourseDto: EnrollCourseDto): Promise<UserDocument> {
    const { userId, courseId } = enrollCourseDto;

    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const course = await this.courseModel.findById(courseObjectId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (user.courses.some((id) => id.toString() === courseObjectId.toString())) {
      throw new Error('User is already enrolled in this course');
    }

    user.courses.push(courseObjectId);
    await user.save();

    return user;
  }

  // Search courses
  async searchCourses(searchParams: any): Promise<CourseDocument[]> {
    const { title, instructor } = searchParams;
    const query: any = {};

    if (title) {
      query['title'] = { $regex: title, $options: 'i' };
    }

    if (instructor) {
      query['instructor'] = { $regex: instructor, $options: 'i' };
    }

    return this.courseModel.find(query);
  }

  // Update user profile
  async updateUserProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateProfileDto },
      { new: true },
    ).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // Fetch enrolled courses for a user
  async getEnrolledCourses(userId: string): Promise<CourseDocument[]> {
    const user = await this.userModel
      .findById(userId)
      .populate<{ courses: CourseDocument[] }>('courses') // Populate and type courses
      .exec();
  
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    if (!Array.isArray(user.courses)) {
      throw new Error('Courses field is not an array after population');
    }
  
    return user.courses as CourseDocument[]; // Explicitly assert courses as CourseDocument[]
  }
  async getAllStudents(): Promise<User[]> {
    return this.userModel.find({ role: 'student' });
  }
  async updateStudent(id: string, body: any): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: id, role: 'student' },
      body,
      { new: true }
    );
    return updatedUser;
  }
  async deleteStudent(id: string): Promise<{ message: string }> {
    const result = await this.userModel.deleteOne({ _id: id, role: 'student' });
    return { message: 'Student deleted successfully' };
  }
  async getAllInstructors(): Promise<User[]> {
    return this.userModel.find({ role: 'instructor' });
  }
  
  async updateInstructor(id: string, body: any): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: id, role: 'instructor' },
      body,
      { new: true }
    );
    return updatedUser;
  }
  async updateInstructorProfile(id: string, updateProfileDto: UpdateProfileByInstructorDto): Promise<UserDocument> {
    const user = await this.userModel.findById(id);

    if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Merge new expertise and teaching interests with existing ones
    if (updateProfileDto.expertise) {
        user.expertise = Array.from(new Set([...(user.expertise || []), ...updateProfileDto.expertise]));
    }
    if (updateProfileDto.teachingInterests) {
        user.teachingInterests = Array.from(new Set([...(user.teachingInterests || []), ...updateProfileDto.teachingInterests]));
    }

    await user.save();
    return user;
}

  
  
  
    // Save the user to the database
  async deleteInstructor(id: string): Promise<{ message: string }> {
    const result = await this.userModel.deleteOne({ _id: id, role: 'instructor' });
    return { message: 'Student deleted successfully' };
  }

}