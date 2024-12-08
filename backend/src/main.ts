import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';

async function bootstrap() {
  mongoose.connect('mongodb://localhost:27017/elearning-platform', {
    serverSelectionTimeoutMS: 3000000, // Increase timeout to 30 seconds
  });
  
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
