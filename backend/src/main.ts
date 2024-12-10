import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';  // Make sure this imports the correct AppModule
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Update this to match your frontend's URL
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });
  await app.listen(4000); // Backend now listens on port 4000
  console.log('Application is running on: http://localhost:4000');
}
bootstrap();
