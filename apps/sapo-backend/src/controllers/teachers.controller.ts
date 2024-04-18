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
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTeacherDto } from '../../../../apps/teachers/src/dto/create-teacher.dto';
import { UpdateTeacherDto } from '../../../../apps/teachers/src/dto/update-teacher.dto';
import { lastValueFrom } from 'rxjs';

@Controller('teachers')
export class TeachersController {
  constructor(@Inject('TEACHERS_MICROSERVICE') private client: ClientProxy) {}

  @Get()
  findAllTeachers() {
    const pattern = 'findAllTeachers';
    return this.client.send(pattern, {});
  }

  @Get(':id')
  async findOneTeacher(@Param('id', ParseIntPipe) id: number) {
    const pattern = 'findOneTeacher';
    const teacher = this.client.send(pattern, id);
    if ((await lastValueFrom(teacher)) == null) throw new NotFoundException();
    return teacher;
  }

  @Post()
  createTeacher(@Body() dto: CreateTeacherDto) {
    const pattern = 'createTeacher';
    return this.client.send(pattern, dto);
  }

  @Patch(':id')
  updateTeacher(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTeacherDto,
  ) {
    const pattern = 'updateTeacher';
    return this.client.send(pattern, { id, ...dto });
  }

  @Delete(':id')
  @HttpCode(204)
  async removeTeacher(@Param('id', ParseIntPipe) id: string) {
    const pattern = 'removeTeacher';
    return this.client.send(pattern, id);
  }

  @Delete()
  deleteAllSubjects() {
    const pattern = 'removeAllTeachers';
    return this.client.send(pattern, {});
  }
}
