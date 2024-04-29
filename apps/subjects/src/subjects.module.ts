import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@app/common';
import { Subject } from './entities/subject.entity';
import { Teacher } from 'apps/teachers/src/entities/teacher.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Subject, Teacher])],
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
