import { Controller, Post, Body, UnauthorizedException, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('admin/login')
  async adminLogin(@Body() body: { username: string, password: string }) {
    const { username, password } = body;
    const isAdmin = await this.authService.validateAdmin(username, password);
    if (!isAdmin) {
      throw new UnauthorizedException('Invalid admin username');
    }

    const token = this.authService.generateToken({ id: 'admin-id', role: 'admin' });
    return { accessToken: token };
  }
}
