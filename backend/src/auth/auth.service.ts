import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { FailedLogin } from 'src/models/failed-login.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.schema';
import { timestamp } from 'rxjs';


@Injectable()
export class AuthService {
  constructor(@InjectModel(FailedLogin.name) private failedLoginModel: Model<FailedLogin>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService) { }

  // Generate JWT Token
  generateToken(user: any): string {
    const payload = { sub: user.id, role: user.role }; // Include user ID and role
    return this.jwtService.sign(payload, { secret: 'JWT_SECRET', expiresIn: '1h' }); // Explicitly set secret and expiration
  }

  async validateAdmin(username: string, password: string): Promise<boolean> {
    const adminUserName = 'admin'; // Hardcoded admin user
    const adminPassword = 'password123'; // Hardcoded admin password
    return username === adminUserName && password === adminPassword;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username });
  }

  async validateUser(username: string, passwrod: string): Promise<boolean> {
    const user = await this.findUserByUsername(username);

    if (!user || user.passwordHash !== passwrod) {
      await new this.failedLoginModel({
        username,
        reason: user ? 'Invalid Password' : 'User not found',
        timestamp: new Date(),
      }).save();
      return false;
    }

    return true;
  }
}
