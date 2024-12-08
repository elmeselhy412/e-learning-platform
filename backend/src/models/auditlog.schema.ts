import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema()
export class AuditLog {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  action: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  details: any; // Store any additional details
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
