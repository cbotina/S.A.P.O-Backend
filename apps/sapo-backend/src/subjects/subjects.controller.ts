import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateSubjectDto } from '../../../../apps/subjects/src/dto/create-subject.dto';
import { UpdateSubjectDto } from '../../../../apps/subjects/src/dto/update-subject.dto';
import { lastValueFrom } from 'rxjs';

@Controller('subjects')
export class SubjectsController {
  constructor(@Inject('SUBJECTS_MICROSERVICE') private client: ClientProxy) {}

  @Get()
  findAll() {
    const pattern = 'findAllSubjects';
    return this.client.send(pattern, {});
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const pattern = 'findOneSubject';
    const subject = this.client.send(pattern, id);
    if ((await lastValueFrom(subject)) == null) throw new NotFoundException();
    return subject;
  }

  @Post()
  createSubject(@Body() dto: CreateSubjectDto) {
    const pattern = 'createSubject';
    return this.client.send(pattern, dto);
  }

  @Patch(':id')
  updateSubject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubjectDto,
  ) {
    const pattern = 'updateSubject';
    return this.client.send(pattern, { id, ...dto });
  }

  @Delete(':id')
  @HttpCode(204)
  async removeSubject(@Param('id', ParseIntPipe) id: string) {
    const pattern = 'removeSubject';
    return this.client.send(pattern, id);
  }

  @Delete()
  deleteAll() {
    const pattern = 'removeAll';
    return this.client.send(pattern, {});
  }
}
