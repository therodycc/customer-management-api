import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { PostgresExceptionFilter } from './common/filters/postgres-exception.filter';

async function bootstrap() {
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : [];

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: corsOrigins,
      credentials: true,
    },
  });

  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get('API_PREFIX'));
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new PostgresExceptionFilter());

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const config = new DocumentBuilder()
    .setTitle(configService.get('API_TITLE'))
    .setDescription(configService.get('API_DESCRIPTION'))
    .setVersion(configService.get('API_VERSION'))
    .addServer(configService.get('API_SERVER_URL'))
    .addCookieAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(configService.get('PORT'));
}
bootstrap();
