import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Broadcast } from '../models/broadcast.schema';

@Injectable()
export class BroadcastService {
  constructor(
    @InjectModel(Broadcast.name) private broadcastModel: Model<Broadcast>,
  ) {}

  async createBroadcast(title: string, message: string, userTypes: string[]): Promise<Broadcast> {
    const broadcast = new this.broadcastModel({ title, message, userTypes });
    return broadcast.save();
  }

  async getAllBroadcasts(): Promise<Broadcast[]> {
    return this.broadcastModel.find().sort({ createdAt: -1 }).exec();
  }

  async getBroadcastById(id: string): Promise<Broadcast> {
    const broadcast = await this.broadcastModel.findById(id).exec();
    if (!broadcast) {
      throw new NotFoundException(`Broadcast with ID ${id} not found`);
    }
    return broadcast;
  }

  async deleteBroadcast(id: string): Promise<void> {
    const result = await this.broadcastModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Broadcast with ID ${id} not found`);
    }
  }
}
