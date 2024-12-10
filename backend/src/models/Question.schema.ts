// question.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Question extends Document {
  @Prop({ required: true })
  questionText: string;

  @Prop({ required: true, enum: ['Easy', 'Medium', 'Hard'] })
  difficulty: string;

  @Prop({ required: true })
  correctAnswer: string;

  @Prop([String])
  options: string[];

  @Prop({ default: 0 })
  createdAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
