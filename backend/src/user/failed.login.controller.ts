import { Controller, Get } from '@nestjs/common';
import { FailedLoginService } from './failed.login.service';

@Controller('failed-logins')
export class FailedLoginController {
  constructor(private readonly failedLoginService: FailedLoginService) {}

  @Get()
  async getFailedLogins() {
    return await this.failedLoginService.getFailedLogins();
  }
}
