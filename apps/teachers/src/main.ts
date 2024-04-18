import { NestFactory } from '@nestjs/core';
import { TeachersModule } from './teachers.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TeachersModule,
    {
      transport: Transport.TCP,
      options: { port: 3002 },
    },
  );

  console.log(
    ` ✅ Teachers Microservice running on ${process.env.NODE_ENV} mode ✅`,
  );

  await app.listen();
}
bootstrap();
