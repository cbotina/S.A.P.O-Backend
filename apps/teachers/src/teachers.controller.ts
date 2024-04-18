import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Controller()
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @MessagePattern('createTeacher')
  create(@Payload() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.create(createTeacherDto);
  }

  @MessagePattern('findAllTeachers')
  findAll() {
    return this.teachersService.findAll();
  }

  @MessagePattern('findOneTeacher')
  findOne(@Payload() id: number) {
    return this.teachersService.findOne(id);
  }

  @MessagePattern('updateTeacher')
  update(@Payload() updateTeacherDto: UpdateTeacherDto) {
    return this.teachersService.update(updateTeacherDto.id, updateTeacherDto);
  }

  @MessagePattern('removeTeacher')
  remove(@Payload() id: number) {
    return this.teachersService.remove(id);
  }

  @MessagePattern('removeAllTeachers')
  removeAll() {
    return this.teachersService.removeAll();
  }
}
