import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<Course>;

@Schema()
export class Course {
  @Prop({ required: true, unique: true })
  courseId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ enum: ['Beginner', 'Intermediate', 'Advanced'], required: true })
  difficultyLevel: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: string; 

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  instructorId: string;

  @Prop({ type: [String], default: [] }) // Array to store file paths
  media: string[];
}


export const CourseSchema = SchemaFactory.createForClass(Course);
