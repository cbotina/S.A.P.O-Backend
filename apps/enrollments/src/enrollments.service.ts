import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'apps/students/src/entities/student.entity';
import { Subject } from 'apps/subjects/src/entities/subject.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createStudentEnrollments(studentId: number, subjectsId: number[]) {
    const student = await this.studentsRepository.findOneBy({
      id: studentId,
    });

    if (student == null)
      throw new RpcException({
        message: `Student with id ${studentId} not found`,
        status: 404,
      });

    const subjects = [];

    for (const id of subjectsId) {
      const subject = await this.subjectsRepository.findOneBy({ id });

      if (subject == null)
        throw new RpcException({
          message: `Subject with id ${id} not found`,
          status: 404,
        });

      subjects.push(subject);
    }

    student.subjects = subjects;

    await this.studentsRepository.save(student);

    return true;
  }
}
