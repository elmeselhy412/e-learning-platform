import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from '../models/course.schema'; 

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course.name) private readonly courseModel: Model<Course>) {}

  // Create a new course
  async createCourse(createCourseDto: any): Promise<Course> {
    const createdCourse = new this.courseModel(createCourseDto);
    return createdCourse.save();
  }

  // Get all courses
  async getAllCourses(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  // Get a course by ID
  async getCourseById(id: string): Promise<Course> {
    return this.courseModel.findById(id).exec();
  }

  // Update a course by ID
  async updateCourse(id: string, updateCourseDto: any): Promise<Course> {
    return this.courseModel.findByIdAndUpdate(id, updateCourseDto, { new: true }).exec();
  }

  // Delete a course by ID
  async deleteCourse(id: string): Promise<any> {
    return this.courseModel.findByIdAndDelete(id).exec();
  }
}
