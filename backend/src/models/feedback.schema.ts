import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Feedback extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  feedback: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
