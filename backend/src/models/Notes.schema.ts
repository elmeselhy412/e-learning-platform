import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type NoteDocument = HydratedDocument<Note>;

@Schema({ timestamps: true }) // Automatically manages createdAt and updatedAt
export class Note {
  @Prop({ required: true, unique: true })
  noteId: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null })
  courseId?: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ default: Date.now })
  lastUpdated: Date; // Explicitly define the lastUpdated property
}

export const NoteSchema = SchemaFactory.createForClass(Note);
