import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      stopAtFirstError: true,
      transform: true,
    }),
  );
  console.log('==================');
  console.log(process.env.NODE_ENV);
  console.log('==================');
  await app.listen(3000);
}

bootstrap();
