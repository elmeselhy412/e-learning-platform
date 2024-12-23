import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class LoginActivityLog extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  eventType: 'login-success' | 'login-failed' | 'mfa-enabled' | 'mfa-verified';

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: false })
  reason?: string; // For failed logins, e.g., "Invalid Password"
}

export const LoginActivityLogSchema = SchemaFactory.createForClass(LoginActivityLog);
export type LoginActivityLogDocument = LoginActivityLog & Document;
