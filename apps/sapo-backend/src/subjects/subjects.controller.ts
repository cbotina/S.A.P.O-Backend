import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateSubjectDto } from '../../../../apps/subjects/src/dto/create-subject.dto';

@Controller('subjects')
export class SubjectsController {
  constructor(@Inject('SUBJECTS_MICROSERVICE') private client: ClientProxy) {}

  @Get()
  findAll() {
    const pattern = 'findAllSubjects';
    const payload = [1, 2, 3];
    return this.client.send(pattern, payload);
  }

  @Get('hello')
  getHello() {
    return 'Hello';
    // const pattern = 'getHello';
    // const payload = [1, 2, 3];
    // return this.client.send(pattern, payload);
  }

  @Post()
  createSubject(@Body() dto: CreateSubjectDto) {
    const pattern = 'createSubject';
    return this.client.send(pattern, dto);
  }
}
