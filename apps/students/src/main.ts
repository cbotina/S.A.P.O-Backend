import { NestFactory } from '@nestjs/core';
import { StudentsModule } from './students.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    StudentsModule,
    {
      transport: Transport.TCP,
    },
  );
  await app.listen();
}
bootstrap();
