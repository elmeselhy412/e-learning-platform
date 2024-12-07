import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<Response>;


@Schema()
export class Response {
  @Prop({ required: true, unique: true })
  responseId: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string; 

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' })
  quizId: string; 

  @Prop({ type: Array, required: true })
  answers: object[]; 

  @Prop({ required: true })
  score: number;

  @Prop({ default: Date.now })
  submittedAt: Date;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
