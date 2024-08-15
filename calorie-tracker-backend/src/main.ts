import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Retirer l'adaptateur WebSocket
  // app.useWebSocketAdapter(new WsAdapter(app));

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.listen(3000);
  console.log('Backend is listening on port 3000');
}
bootstrap();
