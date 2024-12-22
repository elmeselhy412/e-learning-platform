import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';  // Make sure this imports the correct AppModule
import mongoose from 'mongoose';

async function bootstrap() {
  mongoose.connect('mongodb://localhost:27017/elearning-platform', {
    serverSelectionTimeoutMS: 3000000, // Increase timeout to 30 seconds
  });
  
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Update this to match your frontend's URL
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
  });
  await app.listen(4000); // Backend now listens on port 4000
  console.log('Application is running on: http://localhost:4000');
}
bootstrap();
