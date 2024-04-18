import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @MaxLength(150)
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
