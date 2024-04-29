import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateSubjectTeacherDto {
  id: number;

  @IsNumber()
  @IsNotEmpty()
  teacherId: number;
}
