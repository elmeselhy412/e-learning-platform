import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'JWT_SECRET', // Same secret used in AuthService
    });
    
  }

  async validate(payload: any) {
    console.log('Validating Payload:', payload);
    return { userId: payload.sub, role: payload.role }; // Attach this to req.user
  }
}