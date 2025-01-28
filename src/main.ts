import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { MongoTransport } from './logging/mongo.transport';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // Crear el logger de Winston
  const winstonLogger = winston.createLogger({
    transports: [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ],
  });

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: winstonLogger,
    }),
  });

  const configService = app.get(ConfigService);
  const mongoLogsUri = configService.get<string>('database.logsUri');
  
  logger.log(`Attempting to connect to MongoDB logs at: ${mongoLogsUri}`);
  
  // Añadir el transport de MongoDB
  winstonLogger.add(
    new MongoTransport({
      db: mongoLogsUri,
      collection: 'logs',
    })
  );

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const port = configService.get<number>('port');
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,  // Habilita la transformación automática
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
}

bootstrap();