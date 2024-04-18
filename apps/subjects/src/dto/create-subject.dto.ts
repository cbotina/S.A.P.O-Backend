import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  nCredits: number;

  @IsString()
  @MaxLength(150)
  @IsNotEmpty()
  description: string;
}
