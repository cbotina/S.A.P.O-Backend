import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { UpdateSubjectTeacherDto } from './dto/update-subject-teacher.dto';
import { Teacher } from 'apps/teachers/src/entities/teacher.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  create(createSubjectDto: CreateSubjectDto) {
    return this.subjectsRepository.save(createSubjectDto);
  }

  findAll(): Promise<Subject[]> {
    return this.subjectsRepository.find();
  }

  findOne(id: number): Promise<Subject | null> {
    return this.subjectsRepository.findOneBy({ id });
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto): Promise<void> {
    await this.subjectsRepository.update({ id }, updateSubjectDto);
    return null;
  }

  async updateTeacher(
    id: number,
    updateSubjectDto: UpdateSubjectTeacherDto,
  ): Promise<void> {
    const subject = await this.subjectsRepository.findOneBy({ id: id });
    const teacher = await this.teachersRepository.findOneBy({
      id: updateSubjectDto.teacherId,
    });

    if (subject == null)
      throw new RpcException({
        message: `Subject with id ${updateSubjectDto.id} not found`,
        status: 404,
      });

    if (teacher == null)
      throw new RpcException({
        message: `Teacher with id ${updateSubjectDto.teacherId} not found`,
        status: 404,
      });

    subject.teacher = teacher;

    await this.subjectsRepository.save(subject);
    return null;
  }

  async remove(id: number): Promise<void> {
    await this.subjectsRepository.delete(id);
    return null;
  }

  async removeAll(): Promise<void> {
    await this.subjectsRepository.delete({});
    return null;
  }
}
