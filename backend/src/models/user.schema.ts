import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';  // Import mongoose to use ObjectId

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
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Course', default: [] })
  courses: mongoose.Schema.Types.ObjectId[];  // Array of ObjectIds referencing Course
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
