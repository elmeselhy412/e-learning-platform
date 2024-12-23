import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Broadcast extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: [String], default: [] }) // Optionally allow categories or user types
  userTypes: string[]; // e.g., ['student', 'instructor', 'admin']
}

export const BroadcastSchema = SchemaFactory.createForClass(Broadcast);
