import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from '../models/course.schema'; 
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
  ],
  providers: [CoursesService],
  controllers: [CoursesController],
  exports: [MongooseModule],
})
export class CourseModule {}
