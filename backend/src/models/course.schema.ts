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

  @Prop({ required: false })
  instructorId: string;

  @Prop({ type: [String], default: [] }) // Array to store file paths
  media: string[];
  
  @Prop({ required: false })
  archived: boolean;

  @Prop({
    type: [
      {
        content: { type: String, required: true },
        updatedBy: { type: String, required: true }, // Username or ID of the user
        updatedAt: { type: Date, default: Date.now }, // Timestamp of update
      },
    ],
    default: [],
  })
  revisions: {
    content: string;
    updatedBy: string;
    updatedAt: Date;
  }[];

  @Prop({ default: '' })
  content: string; // Current course content
}

export const CourseSchema = SchemaFactory.createForClass(Course);
export type CourseDocument = Course & Document;
