import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateSubjectDto } from '../../../subjects/src/dto/create-subject.dto';
import { UpdateSubjectDto } from '../../../subjects/src/dto/update-subject.dto';
import { lastValueFrom } from 'rxjs';
import { UpdateSubjectTeacherDto } from '../../../../apps/subjects/src/dto/update-subject-teacher.dto';

@Controller('subjects')
export class SubjectsController {
  constructor(@Inject('SUBJECTS_MICROSERVICE') private client: ClientProxy) {}

  @Get()
  findAllSubject() {
    const pattern = 'findAllSubjects';
    return this.client.send(pattern, {});
  }

  @Get(':id')
  async findOneSubject(@Param('id', ParseIntPipe) id: number) {
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

  @Patch(':id/teacher')
  async updateSubjectTeacher(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubjectTeacherDto,
  ) {
    const pattern = 'updateSubjectTeacher';
    //return this.client.send(pattern, { id, ...dto });

    await lastValueFrom(this.client.send(pattern, { id, ...dto })).catch(
      (msg) => {
        throw new HttpException(msg.message, msg.status, {});
      },
    );
    return { message: 'Teacher assigned successfully' };
  }

  @Delete(':id')
  @HttpCode(204)
  async removeSubject(@Param('id', ParseIntPipe) id: string) {
    const pattern = 'removeSubject';
    return this.client.send(pattern, id);
  }

  @Delete()
  deleteAllSubjects() {
    const pattern = 'removeAllSubjects';
    return this.client.send(pattern, {});
  }
}
