import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService
    
  ) {}

  // Generate JWT Token
  generateToken(user: any): string {
    
    const payload = { sub: user.id, role: user.role }; // Include user ID and role
    return this.jwtService.sign(payload, { secret: 'JWT_SECRET', expiresIn: '1h' }); // Explicitly set secret and expiration
  }
}
