import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from 'src/dto/create-course.dto';

@Injectable()
export class CoursesService {
    createCourse(createCourseDto: CreateCourseDto) {
        throw new Error('Method not implemented.');
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
