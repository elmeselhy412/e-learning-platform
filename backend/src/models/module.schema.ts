import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

export type ModuleDocument = HydratedDocument<Module>;

@Schema()
export class Module extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  courseId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  content: string;

  @Prop({ required: true })
  order: number;

  @Prop({ type: [String], default: [] })
  media: string[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
