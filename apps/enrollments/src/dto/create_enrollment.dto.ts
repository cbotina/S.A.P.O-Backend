import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { number } from 'joi';

export class CreateEnrollmentDto {
  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @IsArray()
  //   @ValidateNested({ each: true })
  @Type(() => number)
  subjectsId: number[];
}
