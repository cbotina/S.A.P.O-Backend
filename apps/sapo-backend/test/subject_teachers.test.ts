import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { beforeEach } from 'node:test';
import { CreateSubjectDto } from '../../subjects/src/dto/create-subject.dto';
import { CreateTeacherDto } from 'apps/teachers/src/dto/create-teacher.dto';

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
    await request(app.getHttpServer()).delete('/teachers');
  });

  afterEach(async () => {
    await request(app.getHttpServer()).delete('/subjects');
    await request(app.getHttpServer()).delete('/teachers');
  });

  describe('HU-010 - Asignar docente a materia', () => {
    describe('[CID-1] Cuando se ingrese un id valido', () => {
      const createTeacherDto: CreateTeacherDto = {
        name: 'Giovanni',
        lastName: 'Hernandez',
        email: 'gio@umariana.edu.co',
      };

      const createSubjectDto: CreateSubjectDto = {
        name: 'Ingenieria de Software I',
        description: 'Mas que una materia',
        nCredits: 3,
      };

      it('Entonces, se debe asignar el docente con dicho id a la materia', async () => {
        const teacherId = await request(app.getHttpServer())
          .post('/teachers')
          .send(createTeacherDto)
          .then((res) => res.body.id);

        const subjectId = await request(app.getHttpServer())
          .post('/subjects')
          .send(createSubjectDto)
          .then((res) => res.body.id);

        const updateSubjectTeacherDto = {
          teacherId,
        };

        await request(app.getHttpServer())
          .patch(`/subjects/${subjectId}/teacher`)
          .send(updateSubjectTeacherDto)
          .expect(200);

        await request(app.getHttpServer())
          .get(`/subjects/${subjectId}`)
          .then((res) => {
            expect(res.body.teacher.id).toBe(teacherId);
          });
      });
    });

    describe('[CID-2] Cuando se ingrese un id invalido', () => {
      const createSubjectDto: CreateSubjectDto = {
        name: 'Ingenieria de Software I',
        description: 'Mas que una materia',
        nCredits: 3,
      };
      it('Entonces, se debe mostrar un mensaje de error indicando que el id no es valido', async () => {
        const subjectId = await request(app.getHttpServer())
          .post('/subjects')
          .send(createSubjectDto)
          .then((res) => res.body.id);

        const updateSubjectTeacherDto = {
          teacherId: 'hola',
        };

        await request(app.getHttpServer())
          .patch(`/subjects/${subjectId}/teacher`)
          .send(updateSubjectTeacherDto)
          .expect(400);

        await request(app.getHttpServer())
          .get(`/subjects/${subjectId}`)
          .then((res) => {
            expect(res.body.teacher).toBe(null);
          });
      });
    });

    describe('[CID-3] Cuando no existe ningun docente con el id ingresado', () => {
      const createSubjectDto: CreateSubjectDto = {
        name: 'Ingenieria de Software I',
        description: 'Mas que una materia',
        nCredits: 3,
      };
      it('Entonces, se debe mostrar un mensaje de error indicando que no existe ningun docente con el id ingresado', async () => {
        const subjectId = await request(app.getHttpServer())
          .post('/subjects')
          .send(createSubjectDto)
          .then((res) => res.body.id);

        const updateSubjectTeacherDto = {
          teacherId: 99,
        };

        await request(app.getHttpServer())
          .patch(`/subjects/${subjectId}/teacher`)
          .send(updateSubjectTeacherDto)
          .expect(404);

        await request(app.getHttpServer())
          .get(`/subjects/${subjectId}`)
          .then((res) => {
            expect(res.body.teacher).toBe(null);
          });
      });
    });
  });
  describe('HU-011 - Cambiar docente de materia', () => {
    describe('[CID-1] Cuando se ingrese un id valido', () => {
      const createTeacherDto: CreateTeacherDto = {
        name: 'Giovanni',
        lastName: 'Hernandez',
        email: 'gio@umariana.edu.co',
      };

      const createNewTeacherDto: CreateTeacherDto = {
        name: 'Gustavo',
        lastName: 'Sanchez',
        email: 'gsanchez@gusgus.com',
      };

      const createSubjectDto: CreateSubjectDto = {
        name: 'Ingenieria de Software I',
        description: 'Mas que una materia',
        nCredits: 3,
      };

      it('Entonces, se debe asignar el docente con dicho id a la materia', async () => {
        const teacherId = await request(app.getHttpServer())
          .post('/teachers')
          .send(createTeacherDto)
          .then((res) => res.body.id);

        const newTeacherId = await request(app.getHttpServer())
          .post('/teachers')
          .send(createNewTeacherDto)
          .then((res) => res.body.id);

        const subjectId = await request(app.getHttpServer())
          .post('/subjects')
          .send(createSubjectDto)
          .then((res) => res.body.id);

        const updateSubjectTeacherDto = {
          teacherId,
        };

        await request(app.getHttpServer())
          .patch(`/subjects/${subjectId}/teacher`)
          .send(updateSubjectTeacherDto)
          .expect(200);

        await request(app.getHttpServer())
          .patch(`/subjects/${subjectId}/teacher`)
          .send({ teacherId: newTeacherId })
          .expect(200);

        await request(app.getHttpServer())
          .get(`/subjects/${subjectId}`)
          .then((res) => {
            expect(res.body.teacher.id).toBe(newTeacherId);
          });
      });
    });

    describe('[CID-2] Cuando se ingrese un id invalido', () => {
      const createSubjectDto: CreateSubjectDto = {
        name: 'Ingenieria de Software I',
        description: 'Mas que una materia',
        nCredits: 3,
      };

      const createTeacherDto: CreateTeacherDto = {
        name: 'Giovanni',
        lastName: 'Hernandez',
        email: 'gio@umariana.edu.co',
      };

      it('Entonces, se debe mostrar un mensaje de error indicando que el id no es valido', async () => {
        const subjectId = await request(app.getHttpServer())
          .post('/subjects')
          .send(createSubjectDto)
          .then((res) => res.body.id);

        const teacherId = await request(app.getHttpServer())
          .post('/teachers')
          .send(createTeacherDto)
          .then((res) => res.body.id);

        await request(app.getHttpServer())
          .patch(`/subjects/${subjectId}/teacher`)
          .send({ teacherId })
          .expect(200);

        const updateSubjectTeacherDto = {
          teacherId: 'hola',
        };

        await request(app.getHttpServer())
          .patch(`/subjects/${subjectId}/teacher`)
          .send(updateSubjectTeacherDto)
          .expect(400);

        await request(app.getHttpServer())
          .get(`/subjects/${subjectId}`)
          .then((res) => {
            expect(res.body.teacher.id).toBe(teacherId);
          });
      });
    });

    describe('[CID-3] Cuando no existe ningun docente con el id ingresado', () => {
      const createSubjectDto: CreateSubjectDto = {
        name: 'Ingenieria de Software I',
        description: 'Mas que una materia',
        nCredits: 3,
      };

      const createTeacherDto: CreateTeacherDto = {
        name: 'Giovanni',
        lastName: 'Hernandez',
        email: 'gio@umariana.edu.co',
      };

      it('Entonces, se debe mostrar un mensaje de error indicando que no existe ningun docente con el id ingresado', async () => {
        const subjectId = await request(app.getHttpServer())
          .post('/subjects')
          .send(createSubjectDto)
          .then((res) => res.body.id);

        const teacherId = await request(app.getHttpServer())
          .post('/teachers')
          .send(createTeacherDto)
          .then((res) => res.body.id);

        await request(app.getHttpServer())
          .patch(`/subjects/${subjectId}/teacher`)
          .send({ teacherId })
          .expect(200);

        const updateSubjectTeacherDto = {
          teacherId: 99,
        };

        await request(app.getHttpServer())
          .patch(`/subjects/${subjectId}/teacher`)
          .send(updateSubjectTeacherDto)
          .expect(404);

        await request(app.getHttpServer())
          .get(`/subjects/${subjectId}`)
          .then((res) => {
            expect(res.body.teacher.id).toBe(teacherId);
          });
      });
    });
  });
});
