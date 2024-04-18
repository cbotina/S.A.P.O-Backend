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
import { CreateStudentDto } from '../../../../apps/students/src/dto/create-student.dto';
import { UpdateStudentDto } from '../../../../apps/students/src/dto/update-student.dto';
import { lastValueFrom } from 'rxjs';

@Controller('students')
export class StudentsController {
  constructor(@Inject('STUDENTS_MICROSERVICE') private client: ClientProxy) {}

  @Get()
  findAllStudents() {
    const pattern = 'findAllStudents';
    return this.client.send(pattern, {});
  }

  @Get(':id')
  async findOneStudent(@Param('id', ParseIntPipe) id: number) {
    const student = 'findOneStudent';
    const subject = this.client.send(student, id);
    if ((await lastValueFrom(subject)) == null) throw new NotFoundException();
    return subject;
  }

  @Post()
  createStudent(@Body() dto: CreateStudentDto) {
    const pattern = 'createStudent';
    return this.client.send(pattern, dto);
  }

  @Patch(':id')
  updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStudentDto,
  ) {
    const pattern = 'updateStudent';
    return this.client.send(pattern, { id, ...dto });
  }

  @Delete(':id')
  @HttpCode(204)
  async removeStudent(@Param('id', ParseIntPipe) id: string) {
    const pattern = 'removeStudent';
    return this.client.send(pattern, id);
  }

  @Delete()
  deleteAllStudents() {
    const pattern = 'removeAllStudents';
    return this.client.send(pattern, {});
  }
}
