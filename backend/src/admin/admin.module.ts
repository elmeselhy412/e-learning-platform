import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Course, CourseSchema } from '../models/course.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
