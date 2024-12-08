import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ required: true })
  instructorId: string;

  @Prop({ required: true })
  topic: string;

  @Prop({
    type: [
      {
        userId: { type: String, required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  messages: Array<{
    userId: string;
    content: string;
    timestamp: Date;
  }>;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
