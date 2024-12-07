import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<Quiz>;

@Schema()
export class Quiz {
  @Prop({ required: true, unique: true })
  quizId: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Module' })
  moduleId: string; 

  @Prop({ type: Array, required: true })
  questions: object[]; 

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
