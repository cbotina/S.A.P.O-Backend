import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SubjectsController } from './controllers/subjects.controller';
import { StudentsController } from './controllers/students.controller';
import { TeachersController } from './controllers/teachers.controller';
import { EnrollmentsController } from './controllers/enrollments.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SUBJECTS_MICROSERVICE',
        transport: Transport.TCP,
        options: { port: 3003 },
      },
      {
        name: 'STUDENTS_MICROSERVICE',
        transport: Transport.TCP,
        options: { port: 3001 },
      },
      {
        name: 'TEACHERS_MICROSERVICE',
        transport: Transport.TCP,
        options: { port: 3002 },
      },
      {
        name: 'ENROLLMENTS_MICROSERVICE',
        transport: Transport.TCP,
        options: { port: 3004 },
      },
    ]),
  ],
  controllers: [
    AppController,
    SubjectsController,
    StudentsController,
    TeachersController,
    EnrollmentsController,
  ],
  providers: [AppService],
})
export class AppModule {}
