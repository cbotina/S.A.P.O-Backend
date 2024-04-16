import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SubjectsModule } from './subjects.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SubjectsModule,
    {
      transport: Transport.TCP,
    },
  );
  await app.listen();
}
bootstrap();
