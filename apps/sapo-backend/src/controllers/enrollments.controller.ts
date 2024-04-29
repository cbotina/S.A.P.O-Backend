import { Body, Controller, HttpException, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateEnrollmentDto } from 'apps/enrollments/src/dto/create_enrollment.dto';
import { lastValueFrom } from 'rxjs';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(
    @Inject('ENROLLMENTS_MICROSERVICE') private client: ClientProxy,
  ) {}

  @Post()
  async createStudentEnrollments(@Body() dto: CreateEnrollmentDto) {
    const pattern = 'createStudentEnrollment';
    await lastValueFrom(this.client.send(pattern, dto)).catch((msg) => {
      throw new HttpException(msg.message, msg.status, {});
    });
    return { message: 'Enrollment process was successfully' };
  }
}
