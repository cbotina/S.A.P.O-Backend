import { Test, TestingModule } from '@nestjs/testing';
import {
  ForbiddenException,
  HttpException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { SubjectsService } from 'apps/subjects/src/subjects.service';
import { beforeEach } from 'node:test';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let subjectsService: SubjectsService;

  beforeAll(async () => {
    console.log(process.env.NODE_ENV);

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
    await subjectsService.removeAll();
  });

  afterEach(async () => {
    await subjectsService.removeAll();
  });

  it('/ (GET)', async () => {
    return request(app.getHttpServer())
      .get('/subjects/')
      .expect(200)
      .expect([]);
  });
});
