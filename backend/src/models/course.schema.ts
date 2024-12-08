import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';  // Import mongoose to use ObjectId


@Schema()
export class Course extends Document {
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
}


export const CourseSchema = SchemaFactory.createForClass(Course);
export type CourseDocument = Course & Document;
