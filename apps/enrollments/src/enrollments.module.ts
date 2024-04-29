import { Module } from '@nestjs/common';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { DatabaseModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from 'apps/subjects/src/entities/subject.entity';
import { Student } from 'apps/students/src/entities/student.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Subject, Student])],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
})
export class EnrollmentsModule {}
