import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SubjectsModule } from './subjects.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SubjectsModule,
    {
      transport: Transport.TCP,
      options: { port: 3000 },
    },
  );

  console.log(
    ` ✅ Subjects Microservice running on ${process.env.NODE_ENV} mode ✅`,
  );

  await app.listen();
}
bootstrap();
