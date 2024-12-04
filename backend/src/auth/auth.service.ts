import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../models/user.schema'; // Import the correct types
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {} // Inject UserService


  // Method to generate JWT token
  generateToken(payload: any): string {
    return jwt.sign(payload, 'your-secret-key', { expiresIn: '1h' });
  }

  // Method to verify JWT token
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, 'your-secret-key');
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Example login method
  async login(email: string, password: string): Promise<string> {
    const user: UserDocument | null = await this.userService.findOneByEmail(email );

    if (!user) {
      throw new Error('User not found');
    }

    // Compare passwords (assuming you have a method to check the password)
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate the JWT token with _id and role
    const token = this.generateToken({ userId: user._id, role: user.role });
    return token;
  }
}
