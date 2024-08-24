import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import * as basicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { config } from './config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api');
  app.enableVersioning();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(
    ['/api/docs'],
    basicAuth({
      challenge: true,
      users: { [config.swagger.username]: config.swagger.password },
    }),
  );

  const configSwagger = new DocumentBuilder()
    .setTitle('MedLink API Docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
    console.log(`Swagger UI: http://localhost:${config.port}/api/docs`);
  });
}
bootstrap();
