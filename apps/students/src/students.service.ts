import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  create(createStudentDto: CreateStudentDto) {
    return this.studentsRepository.save(createStudentDto);
  }

  findAll() {
    return this.studentsRepository.find();
  }

  findOne(id: number) {
    return this.studentsRepository.findOne({
      where: { id },
      relations: { subjects: true },
    });
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    await this.studentsRepository.update({ id }, updateStudentDto);
    return null;
  }

  async remove(id: number) {
    await this.studentsRepository.delete(id);
    return null;
  }

  async removeAll() {
    await this.studentsRepository.delete({});
    return null;
  }
}
