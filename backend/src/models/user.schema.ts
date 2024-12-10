import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import mongoose from 'mongoose';  // Import mongoose to use ObjectId
import { CourseModule } from '../courses/courses.module';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ enum: ['student', 'instructor', 'admin'], required: true })
  role: string;

  @Prop({ type: String, default: null, required: false })
  profilePictureUrl?: string;

  @Prop({ default: Date.now, required: false })
  createdAt: Date;

  // Correctly using Schema.Types.ObjectId
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Course' }], default: [] })
  courses: Types.ObjectId[]; // Stored as ObjectId in the database

  
  @Prop({ type: String, default: null }) // Field to store OTP
  otp?: string;

  @Prop({ type: [String], default: [], required: false })
  learningPreferences: string[]; // Array of strings to store learning preferences

  @Prop({ type: [String], default: [], required: false })
  subjectsOfInterest: string[]; // Array of strings to store subjects of interest
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
