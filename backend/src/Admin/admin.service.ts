import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from '../models/course.schema';

@Injectable()
export class AdminService {
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
}