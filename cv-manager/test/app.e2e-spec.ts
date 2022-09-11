import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, Logger } from '@nestjs/common';
import * as createRedisStore from 'connect-redis';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import Redis from 'ioredis';
import { join } from 'node:path';
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let cookie = ''
  let redisClient: Redis = null
  let server
  const user = {
    name: 'john',
    email: 'john.something@gmail.com',
    password: 's3cr3t',
  }
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

    server = app.getHttpServer()
  });

  afterAll(async () => {
    redisClient.disconnect()
    await app.close()
    server.close()
  })

  it('Create user', () => {
    return request(app.getHttpServer())
      .post('/user/signup')
      .send(user)
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('Login as the user', (done) => {
    request(app.getHttpServer())
      .post('/authorization/login')
      .send({ email: 'john.something@gmail.com', password: 's3cr3t' })
      .set('Accept', 'application/json')
      .expect(HttpStatus.CREATED)
      .end((err, res) => {

        cookie = res.headers['set-cookie']
        done()
      });
  });

  it('Check the user is correct', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/me')
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(HttpStatus.OK);

    expect(response.body.email).toEqual(user.email)
  });

  it('Add CV for the user', async () => {
    const response = await request(app.getHttpServer())
      .post('/cv')
      .attach('file',join(__dirname, 'cv-example.pdf'))
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(HttpStatus.OK);

    expect(response.body.status).toEqual('Success')
  });

  it('Check if CV info are correct', async () => {
    const response = await request(app.getHttpServer())
      .get('/cv')
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(HttpStatus.OK);

    expect(response.body.name).toEqual('cv-example.pdf')
  });


  it('Download CV', async () => {
    const response = await request(app.getHttpServer())
      .get('/cv/download')
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(HttpStatus.OK);

    expect(response.headers["content-type"]).toEqual("application/octet-stream");
  });

  it('Delete CV', () => {
    return request(app.getHttpServer())
      .delete('/cv')
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(HttpStatus.OK);
  });

  it('Upload again the CV', async () => {
    const response = await request(app.getHttpServer())
      .post('/cv')
      .attach('file',join(__dirname, 'cv-example.pdf'))
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(HttpStatus.OK);

    expect(response.body.status).toEqual('Success')
  });

  it('Delete user', () => {
    return request(app.getHttpServer())
      .delete('/user/me')
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(HttpStatus.OK);
  });
});
