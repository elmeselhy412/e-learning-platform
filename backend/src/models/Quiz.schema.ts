import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type QuizDocument = HydratedDocument<Quiz>;

@Schema({ timestamps: true }) // Automatically adds `createdAt` and `updatedAt` fields
export class Quiz {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Module' })
  moduleId: mongoose.Schema.Types.ObjectId; // Reference to the Module collection

  @Prop({
    type: [
      {
        question: { type: String, required: true },
        options: {
          type: [
            {
              text: { type: String, required: true },
              isCorrect: { type: Boolean, required: true },
            },
          ],
          required: true,
        },
        correctAnswer: { type: String, required: true },
        difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
        hint: { type: String, default: null },
      },
    ],
    required: true,
  })
  questions: {
    question: string;
    options: { text: string; isCorrect: boolean }[];
    correctAnswer: string;
    difficulty: string;
    hint?: string;
  }[];

  @Prop({ default: Date.now })
  createdAt: Date; // Auto-added by timestamps
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
