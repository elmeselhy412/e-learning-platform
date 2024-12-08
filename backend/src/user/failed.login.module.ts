import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FailedLogin, FailedLoginSchema } from '../models/failed-login.schema';
import { FailedLoginService } from './failed.login.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FailedLogin.name, schema: FailedLoginSchema }]),
  ],
  providers: [FailedLoginService],
  exports: [FailedLoginService], // Export the service so other modules can use it
})
export class FailedLoginModule {}
