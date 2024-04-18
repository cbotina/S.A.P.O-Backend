import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Controller()
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @MessagePattern('getHello')
  getHello() {
    return 'Hello World from subjects microservice!';
  }

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

  @MessagePattern('removeSubject')
  remove(@Payload() id: number) {
    return this.subjectsService.remove(id);
  }
}
