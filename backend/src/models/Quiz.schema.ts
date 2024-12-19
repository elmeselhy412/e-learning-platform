import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Quiz>;

@Schema()
export class Quiz {

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Module' })
  moduleId: string; 

  @Prop({
    type: [
      {
        question: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: String, required: true },
        difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
        hint: { type: String, default: null },
      },
    ],
    required: true,
  })
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
    difficulty: string;
    hint?: string;
  }[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
