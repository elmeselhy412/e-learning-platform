import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FailedLogin } from '../models/failed-login.schema';
@Injectable()
export class FailedLoginService {
    constructor(
        @InjectModel(FailedLogin.name) private readonly failedLoginModel: Model<FailedLogin>,
    ) { }
    // Fetch all failed login attempts
    async getFailedLogins() {
        return this.failedLoginModel.find().sort({ timestamp: -1 }).exec();
    }
}