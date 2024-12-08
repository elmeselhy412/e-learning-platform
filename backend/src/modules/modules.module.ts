import { Module as NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, ModuleSchema } from '../models/module.schema'; // Import Module schema
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';

@NestModule({
  imports: [
    MongooseModule.forFeature([{ name: Module.name, schema: ModuleSchema }]), // Add Module schema
  ],
  providers: [ModuleService],
  controllers: [ModuleController],
  exports: [MongooseModule],
})
export class ModulesModule {}
