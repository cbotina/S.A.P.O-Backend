import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
  isNumber,
} from 'class-validator';
import { number } from 'joi';

export class CreateEnrollmentDto {
  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber(
    {},
    { each: true, message: 'Every element of subjectsId must be a number' },
  )
  subjectsId: number[];
}
