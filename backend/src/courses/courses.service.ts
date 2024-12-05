import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourseDto } from 'src/dto/create-course.dto';
import { Course, CourseDocument } from 'src/models/course.schema';

@Injectable()
export class CoursesService {
    constructor(
        @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
      ) {}
      
      async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
        const createdCourse = new this.courseModel(createCourseDto);
        return createdCourse.save();
      }
    getAllCourses() {
        throw new Error('Method not implemented.');
    }
    updateCourse(id: string, createCourseDto: CreateCourseDto) {
        throw new Error('Method not implemented.');
    }
    deleteCourse(id: string) {
        throw new Error('Method not implemented.');
    }
    getCourseById(id: string) {
        throw new Error('Method not implemented.');
    }
}
