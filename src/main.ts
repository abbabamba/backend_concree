import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Activer CORS pour permettre les requêtes depuis votre frontend
  await app.listen(3001);
}
bootstrap();