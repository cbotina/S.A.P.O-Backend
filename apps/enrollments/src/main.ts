import { NestFactory } from '@nestjs/core';
import { EnrollmentsModule } from './enrollments.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EnrollmentsModule,
    {
      transport: Transport.TCP,
      options: { port: 3004 },
    },
  );

  console.log(
    ` ✅ Enrollemnts Microservice running on ${process.env.NODE_ENV} mode ✅`,
  );

  await app.listen();
}
bootstrap();
