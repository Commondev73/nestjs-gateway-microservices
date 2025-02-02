import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './all-exceptions/all-exceptions.filter';

async function bootstrap() {
  // if you want to use SSL
  //
  // const httpsOptions = {
  //   ca: fs.readFileSync('path/to/your/ssl/ca.pem'),
  //   key: fs.readFileSync('path/to/your/ssl/key.pem'),
  //   cert: fs.readFileSync('path/to/your/ssl/cert.pem'),
  // };
  //
  // const app = await NestFactory.create(AppModule, { httpsOptions });

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const kafkaMicroserviceOptions: MicroserviceOptions = {
    transport: Transport.KAFKA,
    options: {
      client: { brokers: [configService.get<string>('KAFKA_BROKER')] },
      consumer: { groupId: configService.get<string>('KAFKA_GROUP_ID') },
    },
  };

  app.connectMicroservice(kafkaMicroserviceOptions);

  // CORS
  app.enableCors({
    origin: ['*'],
    methods: 'GET,HEAD,PUT,POST,DELETE',
    credentials: true,
  });

  // Cookie parser
  app.use(cookieParser());

  // Global Filters Exceptions
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger
  if (configService.get('NODE_ENV') === 'development') {
    // Documentation Swagger
    const config = new DocumentBuilder()
      .setTitle('API Microservice')
      .setDescription('The Microservice API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    // Set Swagger
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.startAllMicroservices();

  await app.listen(configService.get<number>('APP_PORT') ?? 3000);
}
bootstrap();
