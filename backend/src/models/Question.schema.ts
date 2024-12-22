import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ timestamps: true }) // Automatically adds `createdAt` and `updatedAt` fields
export class Question extends Document {
  @Prop({ required: true })
  questionText: string;

  @Prop({ required: true, enum: ['easy', 'medium', 'hard'] }) // Standardized difficulty case
  difficulty: string;

  @Prop({ required: true })
  correctAnswer: string;

  @Prop({
    type: [
      {
        text: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
      },
    ],
    required: true,
  })
  options: { text: string; isCorrect: boolean }[];

  @Prop({ default: null })
  hint?: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
