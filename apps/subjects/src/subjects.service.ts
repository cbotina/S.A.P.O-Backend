import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
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

  async remove(id: number): Promise<void> {
    await this.subjectsRepository.delete(id);
    return null;
  }

  async removeAll(): Promise<void> {
    await this.subjectsRepository.delete({});
    return null;
  }
}
