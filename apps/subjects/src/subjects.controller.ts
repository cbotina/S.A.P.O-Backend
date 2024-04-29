import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { ExceptionFilter } from 'libs/common/filters/exception_filters';
import { UpdateSubjectTeacherDto } from './dto/update-subject-teacher.dto';

@UseFilters(new ExceptionFilter())
@Controller()
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @MessagePattern('createSubject')
  create(@Payload() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @MessagePattern('findAllSubjects')
  findAll() {
    return this.subjectsService.findAll();
  }

  @MessagePattern('findOneSubject')
  findOne(@Payload() id: number) {
    return this.subjectsService.findOne(id);
  }

  @MessagePattern('updateSubject')
  update(@Payload() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.update(updateSubjectDto.id, updateSubjectDto);
  }

  @MessagePattern('updateSubjectTeacher')
  updateTeacher(@Payload() dto: UpdateSubjectTeacherDto) {
    return this.subjectsService.updateTeacher(dto.id, dto);
  }

  @MessagePattern('removeSubject')
  remove(@Payload() id: number) {
    return this.subjectsService.remove(id);
  }

  @MessagePattern('removeAllSubjects')
  removeAll() {
    return this.subjectsService.removeAll();
  }
}
