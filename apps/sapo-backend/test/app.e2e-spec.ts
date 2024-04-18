import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { SubjectsService } from '../../../apps/subjects/src/subjects.service';
import { beforeEach } from 'node:test';
import { CreateSubjectDto } from '../../../apps/subjects/src/dto/create-subject.dto';
import { SubjectsModule } from '../../../apps/subjects/src/subjects.module';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { AppService } from '../src/app.service';
import { Contains, IsNotEmptyObject, isEmpty } from 'class-validator';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let appService: AppService;
  let client: ClientProxy;

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
  });

  afterEach(async () => {
    await request(app.getHttpServer()).delete('/subjects');
  });

  describe('Cuando se ingresen todos los campos requeridos', () => {
    const dto: CreateSubjectDto = {
      name: 'Ingenieria de Software I',
      description: 'Mas que una materia',
      nCredits: 3,
    };

    it('Entonces, se debe agregar la materia a la base de datos', async () => {
      await request(app.getHttpServer()).get('/subjects').expect(isEmpty);
      await request(app.getHttpServer())
        .post('/subjects')
        .send(dto)
        .expect(201);
      await request(app.getHttpServer())
        .get('/subjects')
        .expect(IsNotEmptyObject);
    });
  });

  describe('Cuando se ingresan campos vacios', () => {
    it('Entonces, se debe mostrar un mensaje de alerta indicando que el campo es requerido', async () => {
      await request(app.getHttpServer()).get('/subjects').expect(isEmpty);

      const dtoWithoutNCredits = {
        name: 'Ingenieria de Software I',
        description: 'Mas que una materia',
      };

      await request(app.getHttpServer())
        .post('/subjects')
        .send(dtoWithoutNCredits)
        .expect(400)
        .expect((res) => {
          const data = res.body;
          expect(data.message[0]).toContain('nCredits should not be empty');
        });

      const dtoWithoutName = {
        description: 'Mas que una materia',
        nCredits: 3,
      };

      await request(app.getHttpServer())
        .post('/subjects')
        .send(dtoWithoutName)
        .expect(400)
        .expect((res) => {
          const data = res.body;
          expect(data.message[0]).toContain('name should not be empty');
        });

      const dtoWithoutDescription = {
        name: 'Ingenieria de Software I',
        nCredits: 3,
      };

      await request(app.getHttpServer())
        .post('/subjects')
        .send(dtoWithoutDescription)
        .expect(400)
        .expect((res) => {
          const data = res.body;
          expect(data.message[0]).toContain('description should not be empty');
        });

      await request(app.getHttpServer()).get('/subjects').expect(isEmpty);
    });
  });

  describe('Cuando algun campo supere el limite de caracteres', () => {
    const dto: CreateSubjectDto = {
      name: 'Ingenieria de Software I',
      description: 'Mas que una materia',
      nCredits: 3,
    };

    it('Entonces, se debe mostrar un mensaje de alerta indicando que los campos en cuestion han excedido el limite de caracteres', async () => {
      await request(app.getHttpServer()).get('/subjects').expect(isEmpty);
      const dtoWithLongName: CreateSubjectDto = {
        name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
        nCredits: 3,
        description: 'Mas que una materia',
      };

      await request(app.getHttpServer())
        .post('/subjects')
        .send(dtoWithLongName)
        .expect(400)
        .expect((res) => {
          const data = res.body;
          expect(data.message[0]).toContain(
            'name must be shorter than or equal to 50 characters',
          );
        });

      const dtoWithLongDescription: CreateSubjectDto = {
        name: 'Ingenieria de Software I',
        nCredits: 3,
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
      };

      await request(app.getHttpServer())
        .post('/subjects')
        .send(dtoWithLongDescription)
        .expect(400)
        .expect((res) => {
          const data = res.body;
          expect(data.message[0]).toContain(
            'description must be shorter than or equal to 150 characters',
          );
        });

      await request(app.getHttpServer()).get('/subjects').expect(isEmpty);
    });
  });

  it('/ (GET)', async () => {
    return request(app.getHttpServer())
      .get('/subjects/')
      .expect(200)
      .expect([]);
  });
});
