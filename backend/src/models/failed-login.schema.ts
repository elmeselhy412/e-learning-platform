import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
@Schema()
export class FailedLogin extends Document {
    @Prop({ required: true })
    username: string;
    @Prop({ required: true, default: new Date() })
    timestamp: Date;
    @Prop({ required: true })
    reason: string;
}
export const FailedLoginSchema = SchemaFactory.createForClass(FailedLogin);
export type FailedLoginDocument = FailedLogin & Document;