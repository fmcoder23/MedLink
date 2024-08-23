import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import * as basicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get<ConfigService>(ConfigService)

  app.setGlobalPrefix('api');
  app.enableVersioning();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(
    ['/api/docs'],
    basicAuth({
      challenge: true,
      users: { [config.get("SWAGGER_USERNAME")]: config.get("SWAGGER_PASSWORD") },
    }),
  );

  const configSwagger = new DocumentBuilder()
    .setTitle('MedLink API Docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(config.get('PORT'), () => {
    console.log(`Server is running on http://localhost:${config.get('PORT')}`);
    console.log(`Swagger UI: http://localhost:${config.get('PORT')}/api/docs`);
  });
}
bootstrap();
