import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Progress>;

@Schema()
export class Progress extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ type: [String], default: [] }) // Completed module IDs
  completedModules: string[];

  @Prop({ type: [Number], default: [] }) // Quiz scores
  scores: number[];

  @Prop({ default: 0 }) // Completion percentage
  completionPercentage: number;

  @Prop({ default: Date.now })
  lastAccessed: Date;

  @Prop({ type: [String], default: [] })
  completedModules: string[]; // Stores completed module IDs

  @Prop({ type: [Number], default: [] })
  scores: number[]; // Stores quiz or assessment scores
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
