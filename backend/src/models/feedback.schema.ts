import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Enable timestamps
export class Feedback extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  feedback: string;

  @Prop({ default: false })
  isForFutureUpdates: boolean;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
