import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { beforeEach } from 'node:test';
import { CreateSubjectDto } from '../../subjects/src/dto/create-subject.dto';
import { CreateTeacherDto } from 'apps/teachers/src/dto/create-teacher.dto';
import { CreateStudentDto } from 'apps/students/src/dto/create-student.dto';
import { CreateEnrollmentDto } from 'apps/enrollments/src/dto/create_enrollment.dto';

describe('Microservicio Materias', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: false,
        stopAtFirstError: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await request(app.getHttpServer()).delete('/subjects');
    await request(app.getHttpServer()).delete('/students');
  });

  afterEach(async () => {
    await request(app.getHttpServer()).delete('/subjects');
    await request(app.getHttpServer()).delete('/students');
  });

  describe('HU-012 - Realizar matricula academica', () => {
    describe('[CID-1] Cuando los ids sean validos y correspondan a materias existentes', () => {
      const subject1Dto: CreateSubjectDto = {
        name: 'Ingenieria de Software II',
        description: 'Mas que una materia',
        nCredits: 3,
      };

      const subject2Dto: CreateSubjectDto = {
        name: 'CISCO CCNA',
        description: 'Redes locas',
        nCredits: 2,
      };

      const subject3Dto: CreateSubjectDto = {
        name: 'Analitica de Datos',
        description: 'Python',
        nCredits: 2,
      };

      const student1Dto: CreateStudentDto = {
        name: 'Carlos',
        lastName: 'Botina',
        email: 'carlos@gmail.com',
      };

      it('Entonces, se debe agregar al estudiante a todas las materias especificadas', async () => {
        const studentId = await request(app.getHttpServer())
          .post('/students')
          .send(student1Dto)
          .then((res) => res.body.id);

        const subject1Id = await request(app.getHttpServer())
          .post('/subjects')
          .send(subject1Dto)
          .then((res) => res.body.id);

        const subject2Id = await request(app.getHttpServer())
          .post('/subjects')
          .send(subject2Dto)
          .then((res) => res.body.id);

        const subject3Id = await request(app.getHttpServer())
          .post('/subjects')
          .send(subject3Dto)
          .then((res) => res.body.id);

        const createEnrollmentDto: CreateEnrollmentDto = {
          studentId,
          subjectsId: [subject1Id, subject2Id, subject3Id],
        };

        await request(app.getHttpServer())
          .post('/enrollments')
          .send(createEnrollmentDto)
          .expect(201);

        await request(app.getHttpServer())
          .get(`/students/${studentId}`)
          .then((res) => {
            expect(res.body.subjects.length).toBe(3);
          });
      });
    });

    describe('[CID-2] Cuando no se ingresen ids de materias', () => {
      const student1Dto: CreateStudentDto = {
        name: 'Carlos',
        lastName: 'Botina',
        email: 'carlos@gmail.com',
      };
      it('Entonces, se debe mostrar un mensaje de error indicando que el id no es valido', async () => {
        const studentId = await request(app.getHttpServer())
          .post('/students')
          .send(student1Dto)
          .then((res) => res.body.id);

        const createEnrollmentDto: CreateEnrollmentDto = {
          studentId,
          subjectsId: [],
        };

        await request(app.getHttpServer())
          .post('/enrollments')
          .send(createEnrollmentDto)
          .expect(400)
          .then((res) => {
            expect(res.body.message).toEqual([
              'subjectsId should not be empty',
            ]);
          });

        await request(app.getHttpServer())
          .get(`/students/${studentId}`)
          .then((res) => {
            expect(res.body.subjects.length).toBe(0);
          });
      });
    });

    describe('[CID-3] Cuando al menos un id sea invalido', () => {
      const subject1Dto: CreateSubjectDto = {
        name: 'Ingenieria de Software II',
        description: 'Mas que una materia',
        nCredits: 3,
      };

      const subject2Dto: CreateSubjectDto = {
        name: 'CISCO CCNA',
        description: 'Redes locas',
        nCredits: 2,
      };

      const subject3Dto: CreateSubjectDto = {
        name: 'Analitica de Datos',
        description: 'Python',
        nCredits: 2,
      };

      const student1Dto: CreateStudentDto = {
        name: 'Carlos',
        lastName: 'Botina',
        email: 'carlos@gmail.com',
      };
      it('Entonces, se debe mostrar un mensaje de error indicando que no existe ningun docente con el id ingresado', async () => {
        const studentId = await request(app.getHttpServer())
          .post('/students')
          .send(student1Dto)
          .then((res) => res.body.id);

        const subject1Id = await request(app.getHttpServer())
          .post('/subjects')
          .send(subject1Dto)
          .then((res) => res.body.id);

        const subject2Id = await request(app.getHttpServer())
          .post('/subjects')
          .send(subject2Dto)
          .then((res) => res.body.id);

        const subject3Id = await request(app.getHttpServer())
          .post('/subjects')
          .send(subject3Dto)
          .then((res) => res.body.id);

        const createEnrollmentDto: CreateEnrollmentDto = {
          studentId,
          subjectsId: [subject1Id, subject2Id, subject3Id, 'hola'],
        };

        await request(app.getHttpServer())
          .post('/enrollments')
          .send(createEnrollmentDto)
          .expect(400)
          .then((res) => {
            expect(res.body.message).toEqual([
              'Every element of subjectsId must be a number',
            ]);
          });

        await request(app.getHttpServer())
          .get(`/students/${studentId}`)
          .then((res) => {
            expect(res.body.subjects.length).toBe(0);
          });
      });
    });

    describe('[CID-4] Cuando al menos una materia ingresada no exista', () => {
      const subject1Dto: CreateSubjectDto = {
        name: 'Ingenieria de Software II',
        description: 'Mas que una materia',
        nCredits: 3,
      };

      const subject2Dto: CreateSubjectDto = {
        name: 'CISCO CCNA',
        description: 'Redes locas',
        nCredits: 2,
      };

      const subject3Dto: CreateSubjectDto = {
        name: 'Analitica de Datos',
        description: 'Python',
        nCredits: 2,
      };

      const student1Dto: CreateStudentDto = {
        name: 'Carlos',
        lastName: 'Botina',
        email: 'carlos@gmail.com',
      };
      it('Entonces, se debe mostrar un mensaje de error indicando que no existe ningun docente con el id ingresado', async () => {
        const studentId = await request(app.getHttpServer())
          .post('/students')
          .send(student1Dto)
          .then((res) => res.body.id);

        const subject1Id = await request(app.getHttpServer())
          .post('/subjects')
          .send(subject1Dto)
          .then((res) => res.body.id);

        const subject2Id = await request(app.getHttpServer())
          .post('/subjects')
          .send(subject2Dto)
          .then((res) => res.body.id);

        const subject3Id = await request(app.getHttpServer())
          .post('/subjects')
          .send(subject3Dto)
          .then((res) => res.body.id);

        const createEnrollmentDto: CreateEnrollmentDto = {
          studentId,
          subjectsId: [subject1Id, subject2Id, subject3Id, 99],
        };

        await request(app.getHttpServer())
          .post('/enrollments')
          .send(createEnrollmentDto)
          .expect(404)
          .then((res) => {
            expect(res.body.message).toBe('Subject with id 99 not found');
          });

        await request(app.getHttpServer())
          .get(`/students/${studentId}`)
          .then((res) => {
            expect(res.body.subjects.length).toBe(0);
          });
      });
    });
  });
});
