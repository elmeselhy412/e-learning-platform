import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('create')
  async createUser(): Promise<string> {
    await this.userService.createUser();
    return 'User created!';
  }
}