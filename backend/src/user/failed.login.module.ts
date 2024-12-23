import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FailedLogin, FailedLoginSchema } from '../models/failed-login.schema';
import { FailedLoginService } from './failed.login.service';
import { FailedLoginController } from './failed.login.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FailedLogin.name, schema: FailedLoginSchema }]),
  ],
  providers: [FailedLoginService],
  controllers: [FailedLoginController], // Add the controller
  exports: [FailedLoginService], // Export the service so other modules can use it
})
export class FailedLoginModule {}
