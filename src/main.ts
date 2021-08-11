import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const staticPath = configService.get<string>('STATIC_PATH');
  
  app.useStaticAssets(join(__dirname, '..', staticPath), {
    prefix: `/${staticPath}/`,
  });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get('PORT'));
}
bootstrap();
