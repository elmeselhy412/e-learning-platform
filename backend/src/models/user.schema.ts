import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

@Schema()
export class User extends Document {  // Inherit from Document to have Mongoose methods
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ enum: ['student', 'instructor', 'admin'], required: true })
  role: string;

  @Prop({ type: String, default: null })
  profilePictureUrl?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// This will automatically add _id to your schema
export type UserDocument = User & Document;
