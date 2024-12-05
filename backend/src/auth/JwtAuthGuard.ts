import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      console.log('AuthGuard Error:', err); // Debugging log
      console.log('AuthGuard Info:', info); // Debugging log
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
