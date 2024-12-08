import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from '../models/course.schema';
import { NotificationDocument } from 'src/models/Notification.schema';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name) // Instantiate the logger with the class name
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  // Retrieve all courses
  async getAllCourses(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  // Archive a course
  async archiveCourse(courseId: string): Promise<Course> {
    const course = await this.courseModel.findOneAndUpdate(
      { _id: courseId }, // Query by the default _id field
      { archived: true }, // Mark the course as archived
      { new: true }, // Return the updated course
    );
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }
  

  // Remove a course
  async removeCourse(courseId: string): Promise<Course> {
    const course = await this.courseModel.findOneAndDelete({ _id: courseId });
    console.log(course._id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async sendNotification(title: string, message: string): Promise<void> {
    // Your code to send notification
    this.logger.log(`Sending notification: ${title} - ${message}`);
  }

  async announceUpdate(): Promise<void> {
    // Your code to announce update
    this.logger.log('Announcing update...');
  }

  // Log error method (optional)
  logError(message: string, stack?: string): void {
    this.logger.error(message, stack);
  }
}