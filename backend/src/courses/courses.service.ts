import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from '../dto/create-course.dto';
import { Course } from 'src/models/course.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>, 

  ) {}
  private courses = []; 

  
  createCourse(createCourseDto: CreateCourseDto) {
    const newCourse = { ...createCourseDto, id: Date.now().toString(), version: 1 };
    this.courses.push(newCourse);
    return newCourse;
  }


  getAllCourses() {
    return this.courses;
  }

  getCourseById(id: string) {
    const course = this.courses.find((course) => course.id === id);
    if (!course) throw new NotFoundException(`Course with ID ${id} not found.`);
    return course;
  }

 

  deleteCourse(id: string) {
    const courseIndex = this.courses.findIndex((course) => course.id === id);
    if (courseIndex === -1) throw new NotFoundException(`Course with ID ${id} not found.`);

    const deletedCourse = this.courses.splice(courseIndex, 1);
    return { message: 'Course deleted successfully', deletedCourse };
  }
   
  async addMediaToCourse(courseId: string, instructorId: string, mediaPaths: string[]): Promise<Course> {
    // Find the course by its ID
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }

    // Check if the logged-in instructor matches the course instructor
    if (course.instructorId !== instructorId) {
      throw new ForbiddenException(`You are not authorized to modify this course.`);
    }

    // Append the new media paths to the existing media array
    course.media.push(...mediaPaths);

    // Save and return the updated course document
    return course.save();
  }
}

