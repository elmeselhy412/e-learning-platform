import { Module } from '@nestjs/common';
import { PythonIntegrationService } from './python-integration.service';
import { PythonIntegrationController } from './python-integration.controller';

@Module({
  controllers: [PythonIntegrationController],
  providers: [PythonIntegrationService],
  exports: [PythonIntegrationService], // Export if other modules need the service
})
export class PythonIntegrationModule {}
