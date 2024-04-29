import { Controller, UseFilters } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateEnrollmentDto } from './dto/create_enrollment.dto';
import { ExceptionFilter } from 'libs/common/filters/exception_filters';

@Controller()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @MessagePattern('updateSubject')
  getHello(): string {
    return this.enrollmentsService.getHello();
  }

  @UseFilters(new ExceptionFilter())
  @MessagePattern('createStudentEnrollment')
  createStudentEnrollment(@Payload() dto: CreateEnrollmentDto) {
    return this.enrollmentsService.createStudentEnrollments(
      dto.studentId,
      dto.subjectsId,
    );
  }
}
