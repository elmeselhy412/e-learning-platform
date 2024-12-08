import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, UserDocument } from '../models/course.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<UserDocument>,
  ) {}

  // Retrieve all courses
  async getAllCourses(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  // Archive a course
  async archiveCourse(courseId: string): Promise<Course> {
    const course = await this.courseModel.findOneAndUpdate(
      { courseId },
      { archived: true },
      { new: true },
    );
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  // Remove a course
  async removeCourse(courseId: string): Promise<Course> {
    const course = await this.courseModel.findOneAndDelete({ courseId });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }
}
