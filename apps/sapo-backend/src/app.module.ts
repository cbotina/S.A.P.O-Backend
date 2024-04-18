import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SubjectsController } from './controllers/subjects.controller';
import { StudentsController } from './controllers/students.controller';
import { TeachersController } from './controllers/teachers.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SUBJECTS_MICROSERVICE',
        transport: Transport.TCP,
        options: { port: 3000 },
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
    ]),
  ],
  controllers: [
    AppController,
    SubjectsController,
    StudentsController,
    TeachersController,
  ],
  providers: [AppService],
})
export class AppModule {}
