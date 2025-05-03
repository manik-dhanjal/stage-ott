import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // enable URI versioning onto endpoints
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Initate validation pipeline for DTOs
  app.useGlobalPipes(new ValidationPipe());

  // Initiate swagger for API documentation
  const config = new DocumentBuilder()
    .setTitle('Stage OTT API')
    .setDescription(
      'API for managing content and user interactions on the Stage OTT platform',
    )
    .setVersion('1.0')
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('oas-docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
