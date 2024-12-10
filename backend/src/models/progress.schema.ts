import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Progress>;

@Schema()
export class Progress {
  @Prop({ required: true, unique: true })
  progressId: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  courseId: string; 

  @Prop({ required: true })
  completionPercentage: number; 

  @Prop({ default: Date.now })
  lastAccessed: Date;

  @Prop({ type: [String], default: [] })
  completedModules: string[]; // Stores completed module IDs

  @Prop({ type: [Number], default: [] })
  scores: number[]; // Stores quiz or assessment scores
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
