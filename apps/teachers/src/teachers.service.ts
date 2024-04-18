import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  create(createTeacherDto: CreateTeacherDto) {
    return this.teachersRepository.save(createTeacherDto);
  }

  findAll() {
    return this.teachersRepository.find();
  }

  findOne(id: number) {
    return this.teachersRepository.findOneBy({ id });
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto) {
    await this.teachersRepository.update({ id }, updateTeacherDto);
    return null;
  }

  async remove(id: number) {
    await this.teachersRepository.delete(id);
    return null;
  }

  async removeAll() {
    await this.teachersRepository.delete({});
    return null;
  }
}
