import { Injectable } from '@nestjs/common'; 
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user.schema'; 
import { Course } from '../models/course.schema'; 
import { CreateUserDto } from 'src/dto/create-user.dto';
import { EnrollCourseDto } from 'src/dto/enroll-course.dto'; // DTO for course enrollment
import mongoose from 'mongoose'; // Import mongoose to use ObjectId

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Course.name) private courseModel: Model<Course>, // Injecting Course model
  ) {}

  // Fetch user by email
  async findByEmail(email: string): Promise<User | null> {
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
  async enrollCourse(enrollCourseDto: EnrollCourseDto): Promise<User> {
    const { userId, courseId } = enrollCourseDto;
  
    // Use mongoose.Schema.Types.ObjectId for courseId
    const courseObjectId = new mongoose.Schema.Types.ObjectId(courseId);  // Fixed line
  
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
    if (user.courses && user.courses.some(courseId => courseId.toString() === courseObjectId.toString())) {
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
