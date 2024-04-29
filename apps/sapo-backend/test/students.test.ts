import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { beforeEach } from 'node:test';
import { IsNotEmptyObject, isEmpty } from 'class-validator';
import { CreateStudentDto } from '../../../apps/students/src/dto/create-student.dto';

describe('Microservicio Estudiantes', () => {
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
    await request(app.getHttpServer()).delete('/students');
  });

  afterEach(async () => {
    await request(app.getHttpServer()).delete('/students');
  });

  describe('HU-004 - Crear Estudiante', () => {
    describe('CID-1 Cuando se ingresen todos los campos requeridos', () => {
      const dto: CreateStudentDto = {
        name: 'Carlos',
        lastName: 'Botina',
        email: 'carlosal.botina@umariana.edu.co',
      };

      it('Entonces, se debe agregar la materia a la base de datos', async () => {
        await request(app.getHttpServer()).get('/students').expect(isEmpty);
        await request(app.getHttpServer())
          .post('/students')
          .send(dto)
          .expect(201);
        await request(app.getHttpServer())
          .get('/students')
          .expect(IsNotEmptyObject);
      });
    });

    describe('CID-2 Cuando se ingresan campos vacios', () => {
      it('Entonces, se debe mostrar un mensaje de alerta indicando que el campo es requerido', async () => {
        await request(app.getHttpServer()).get('/students').expect(isEmpty);

        const dtoWithoutLastName = {
          name: 'Carlos',
          email: 'carlosal.botina@umariana.edu.co',
        };

        await request(app.getHttpServer())
          .post('/students')
          .send(dtoWithoutLastName)
          .expect(400)
          .expect((res) => {
            const data = res.body;
            expect(data.message[0]).toContain('lastName should not be empty');
          });

        const dtoWithoutName = {
          lastName: 'Botina',
          email: 'carlosal.botina@umariana.edu.co',
        };

        await request(app.getHttpServer())
          .post('/students')
          .send(dtoWithoutName)
          .expect(400)
          .expect((res) => {
            const data = res.body;
            expect(data.message[0]).toContain('name should not be empty');
          });

        const dtoWithoutEmail = {
          name: 'Carlos',
          lastName: 'Botina',
        };

        await request(app.getHttpServer())
          .post('/students')
          .send(dtoWithoutEmail)
          .expect(400)
          .expect((res) => {
            const data = res.body;
            expect(data.message[0]).toContain('email should not be empty');
          });

        await request(app.getHttpServer()).get('/students').expect(isEmpty);
      });
    });

    describe('CID-3 Cuando algun campo supere el limite de caracteres', () => {
      it('Entonces, se debe mostrar un mensaje de alerta indicando que los campos en cuestion han excedido el limite de caracteres', async () => {
        await request(app.getHttpServer()).get('/students').expect(isEmpty);
        const dtoWithLongName: CreateStudentDto = {
          name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
          lastName: 'Botina',
          email: 'carlosal.botina@umariana.edu.co',
        };

        await request(app.getHttpServer())
          .post('/students')
          .send(dtoWithLongName)
          .expect(400)
          .expect((res) => {
            const data = res.body;
            expect(data.message[0]).toContain(
              'name must be shorter than or equal to 50 characters',
            );
          });

        const dtoWithLongLastName: CreateStudentDto = {
          name: 'Ingenieria de Software I',
          email: 'carlossal.botina@umariana.edu.co',
          lastName:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
        };

        await request(app.getHttpServer())
          .post('/students')
          .send(dtoWithLongLastName)
          .expect(400)
          .expect((res) => {
            const data = res.body;
            expect(data.message[0]).toContain(
              'lastName must be shorter than or equal to 50 characters',
            );
          });

        await request(app.getHttpServer()).get('/students').expect(isEmpty);
      });
    });
  });

  describe('HU-005 - Editar Estudiante', () => {
    const dto: CreateStudentDto = {
      name: 'Carlos',
      lastName: 'Botina',
      email: 'carlosal.botina@umariana.edu.co',
    };

    describe('CID-1 Cuando se ingresen los datos completos', () => {
      it('Entonces, se debe editar la materia en la base de datos', async () => {
        const id = await request(app.getHttpServer())
          .post('/students')
          .send(dto)
          .expect(201)
          .then((res) => res.body.id);

        await request(app.getHttpServer())
          .patch(`/students/${id}`)
          .send({ name: 'Carlos Alberto' })
          .expect(200);

        await request(app.getHttpServer())
          .get('/students')
          .expect(200)
          .expect((res) => {
            const data = res.body;
            expect(data[0].name).toEqual('Carlos Alberto');
          });
      });
    });
    describe('CID-2 Cuando se ingresen datos vacios', () => {
      it('Entonces, se debe mostrar un mensaje de alerta por cada campo requerido', async () => {
        const id = await request(app.getHttpServer())
          .post('/students')
          .send(dto)
          .expect(201)
          .then((res) => res.body.id);

        await request(app.getHttpServer())
          .patch(`/students/${id}`)
          .send({ name: '', lastName: '', email: '' })
          .expect(400);
      });
    });

    describe('HU-006 - Eliminar materia', () => {
      const dto: CreateStudentDto = {
        name: 'Carlos',
        lastName: 'Botina',
        email: 'carlosal.botina@umariana.edu.co',
      };

      it('Entonces, se debe eliminar la materia de la base de datos', async () => {
        const id = await request(app.getHttpServer())
          .post('/students')
          .send(dto)
          .expect(201)
          .then((res) => res.body.id);

        await request(app.getHttpServer())
          .delete(`/students/${id}`)
          .expect(204);

        await request(app.getHttpServer()).get('/students').expect(isEmpty);
      });
    });
  });
});
