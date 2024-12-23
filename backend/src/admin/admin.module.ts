import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Course, CourseSchema } from '../models/course.schema';
import { LoginActivityLog, LoginActivityLogSchema } from 'src/models/LoginActivityLog.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema },       
    { name: LoginActivityLog.name, schema: LoginActivityLogSchema }, // Register LoginActivityLog model
  ]),],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}