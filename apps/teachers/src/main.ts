import { NestFactory } from '@nestjs/core';
import { TeachersModule } from './teachers.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TeachersModule,
    {
      transport: Transport.TCP,
    },
  );
  await app.listen();
}
bootstrap();
