import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Progress>;

@Schema({ collection: 'progresses' }) // This ensures the schema maps to the correct MongoDB collection
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
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
