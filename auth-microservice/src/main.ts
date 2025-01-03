import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.KAFKA,
    options: {
      client: { brokers: [configService.get<string>('KAFKA_BROKER')] },
      consumer: { groupId: configService.get<string>('KAFKA_GROUP_ID') },
    },
  };

  const microserviceApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, microserviceOptions);

  // Global validation DTO (Data Transfer Object)
  microserviceApp.useGlobalPipes(new ValidationPipe());

  await microserviceApp.listen();
}
bootstrap();
