import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';  // Make sure this imports the correct AppModule

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001', // Frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(3000); // Make sure it's listening on the correct port
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
