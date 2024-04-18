import { Test, TestingModule } from '@nestjs/testing';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

// describe('SubjectsController', () => {
//   let controller: SubjectsController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [SubjectsController],
//       providers: [SubjectsService],
//     }).compile();

//     controller = module.get<SubjectsController>(SubjectsController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   it('hola', async () => {
//     const target: ValidationPipe = new ValidationPipe({
//       transform: true,
//       whitelist: true,
//     });

//     const metadata: ArgumentMetadata = {
//       type: 'body',
//       metatype: CreateSubjectDto,
//       data: '',
//     };

//     const data = {};

//     await target.transform(data, metadata).catch((err) => {
//       expect(err.getResponse().message).toEqual(['your validation error']);
//     });
//   });
// });

describe('', () => {
  it('hola', async () => {
    const data = {};
    const ofDto = plainToInstance(CreateSubjectDto, data);
    const errors = await validate(ofDto);
    expect(errors.length).not.toBe(0);
    expect(stringified(errors)).toContain('');
  });
});
export function stringified(errors: ValidationError[]): string {
  return JSON.stringify(errors);
}
