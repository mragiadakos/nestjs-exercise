import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import * as createRedisStore from 'connect-redis';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import Redis from 'ioredis';
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let cookie = ''
  let redisClient: Redis = null
  beforeAll(async () => {
    const RedisStore = createRedisStore(session);
    redisClient = new Redis();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(
      session({
        store: new RedisStore({ client: redisClient, logErrors: true }),
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 60000,
        },
      }),
    );

    app.use(passport.initialize());
    app.use(passport.session());
    await app.init();
  });

  afterAll(() => {
    redisClient.disconnect()
  })

  it('/user/signup (POST)', () => {
    return request(app.getHttpServer())
      .post('/user/signup')
      .send({
        name: 'john',
        email: 'john.something@gmail.com',
        password: 's3cr3t',
      })
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('/authorization/login (POST)', (done) => {
    request(app.getHttpServer())
      .post('/authorization/login')
      .send({ email: 'john.something@gmail.com', password: 's3cr3t' })
      .set('Accept', 'application/json')
      .expect(201)
      .end((err, res) => {

        cookie = res.headers['set-cookie']
        done()
      });
  });


  it('/user/me (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/user/me')
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(200);
  });
});
