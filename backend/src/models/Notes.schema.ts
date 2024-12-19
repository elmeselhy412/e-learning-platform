import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Note extends Document {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: false })
  courseId?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
export type NoteDocument = Note & Document;
