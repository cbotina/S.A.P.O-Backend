import { NestFactory } from '@nestjs/core';
import { StudentsModule } from './students.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    StudentsModule,
    {
      transport: Transport.TCP,
      options: { port: 3001 },
    },
  );

  console.log(
    ` ✅ Students Microservice running on ${process.env.NODE_ENV} mode ✅`,
  );

  await app.listen();
}
bootstrap();
