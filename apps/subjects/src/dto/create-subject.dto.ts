import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  nCredits: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}
