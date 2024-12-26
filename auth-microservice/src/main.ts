import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global validation DTO (Data Transfer Object)
  app.useGlobalPipes(new ValidationPipe());

  // Global guards (JWT)
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // Swagger 
  if (configService.get('NODE_ENV') === 'development') {
    // Documentation Swagger
    const config = new DocumentBuilder()
      .setTitle('Auth Microservice')
      .setDescription('The Auth Microservice API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    // Set Swagger
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
