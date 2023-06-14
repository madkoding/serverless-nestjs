import * as dotenv from 'dotenv';
dotenv.config();

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors();

  // Configura el swagger de Students
  const options = new DocumentBuilder()
    .setTitle('Alumnos API')
    .setDescription('API para manejar alumnos')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' }, 'apiKey') // Actualiza 'apiKey' aquí
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  // Habilitar validacion de campos
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}

bootstrap();
