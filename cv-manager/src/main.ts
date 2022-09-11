import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as createRedisStore from 'connect-redis';
import Redis from 'ioredis'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const RedisStore = createRedisStore(session);
  const redis = new Redis({
    host: 'localhost',
    port: 6379,
  });
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'debug', 'error', 'verbose', 'warn'],
  });
  app.use(
    session({
      store: new RedisStore({ client: redis, logErrors: true }),
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

  const config = new DocumentBuilder()
    .setTitle('CV Manager')
    .setDescription('The CV manager API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  
  await app.listen(3000);
}
bootstrap();
