import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN'),
    credentials: true,
  });

  await app.listen(process.env.PORT!);
}
bootstrap();
