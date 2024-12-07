import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course, CourseSchema } from '../models/course.schema'; // Import the Course schema
import { Note, NoteSchema } from '../models/Notes.schema'; // Import the Note schema

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema }, // Register Course schema
      { name: Note.name, schema: NoteSchema }, // Register Note schema
    ]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [MongooseModule, CoursesService],
})
export class CourseModule {}
