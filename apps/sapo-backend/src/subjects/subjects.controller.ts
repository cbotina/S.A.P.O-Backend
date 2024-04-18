import { Body, Controller, Delete, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateSubjectDto } from '../../../../apps/subjects/src/dto/create-subject.dto';

@Controller('subjects')
export class SubjectsController {
  constructor(@Inject('SUBJECTS_MICROSERVICE') private client: ClientProxy) {}

  @Get()
  findAll() {
    const pattern = 'findAllSubjects';
    return this.client.send(pattern, {});
  }

  @Post()
  createSubject(@Body() dto: CreateSubjectDto) {
    const pattern = 'createSubject';
    return this.client.send(pattern, dto);
  }

  @Delete()
  deleteAll() {
    const pattern = 'removeAll';
    return this.client.send(pattern, {});
  }
}
