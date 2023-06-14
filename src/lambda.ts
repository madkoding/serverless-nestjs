import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';
import { Server } from 'http';
import * as awsServerlessExpress from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';

let cachedServer: Server;

async function bootstrap(): Promise<Server> {
  const expressApp = express();
  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  nestApp.use(eventContext());

  // Habilitar CORS
  nestApp.enableCors();

  // Configura el swagger de Students
  const options = new DocumentBuilder()
    .setTitle('Alumnos API')
    .setDescription('API para manejar alumnos')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' }, 'apiKey') // Actualiza 'apiKey' aquí
    .build();

  const document = SwaggerModule.createDocument(nestApp, options);
  SwaggerModule.setup('swagger', nestApp, document);

  // Habilitar validacion de campos
  nestApp.useGlobalPipes(new ValidationPipe());

  await nestApp.init();
  return awsServerlessExpress.createServer(expressApp);
}

export const handler = async (event, context) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }

  return awsServerlessExpress.proxy(cachedServer, event, context, 'PROMISE')
    .promise;
};
