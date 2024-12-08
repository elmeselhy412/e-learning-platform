import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Course extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  difficultyLevel: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId; // Reference to the user who created the course

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  instructorId: string;

  @Prop({ type: [String], default: [] }) // Array to store file paths
  media: string[];

}

export const CourseSchema = SchemaFactory.createForClass(Course);
export type CourseDocument = Course & Document;
