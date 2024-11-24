import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(): Promise<void> {
    const newUser = new this.userModel({
      username: 'testuser',
      password: '123456',
      email: 'testuser@example.com',
    });
    await newUser.save();
  }
}

