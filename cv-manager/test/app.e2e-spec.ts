import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/authorization/signup (POST)', () => {
    return request(app.getHttpServer())
      .post('/authorization/signup')
      .send({name: 'john', email:'john.something@gmail.com', password:'s3cr3t'})
      .set('Accept', 'application/json')
      .expect(200)
  });

  it('/authorization/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/authorization/login')
      .send({email:'john.something@gmail.com', password:'s3cr3t'})
      .set('Accept', 'application/json')
      .expect(200)
  });
});
