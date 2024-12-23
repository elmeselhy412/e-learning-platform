import { Schema, model } from 'mongoose';

const MessageSchema = new Schema({
  senderId: String,
  recipientId: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

export const MessageModel = model('Message', MessageSchema);
