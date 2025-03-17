import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import cookieParser from 'cookie-parser';
import { TransformInterceptor } from './interceptors/transform.interceptor';

// LESSON: whitelist property
// EXAMPLE: our DTO has an email and password property, but the request body has an additional property called "name"
// INFO: the request body will be stripped of the "name" property -- which means it will avoid the "name" property from being passed to the service

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // NOTE: Set global prefix
  app.setGlobalPrefix('api');

  // NOTE: Set URI versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // NOTE: Setup JwtAuthGuard as a global guard
  // INFO: the JwtAuthGuard requires the Reflector class inside its constructor in order to work correctly
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // NOTE: Setup TransformInterceptor as a global interceptor
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // NOTE: This will remove any additional properties that are not in the DTO
      forbidNonWhitelisted: true, // NOTE: This will throw an error if there are additional properties that are not in the DTO
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.use(cookieParser());

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port ?? 3000);
}
bootstrap();
