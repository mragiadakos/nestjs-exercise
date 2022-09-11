import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorizationController } from './controllers/authorization.controller';
import { UserRepository } from './repos/user.repository';
import { PrismaService } from './prisma/prisma.service';
import { AuthorizationDomain } from './domain/authorization.domain';
import { AuthModule } from './auth/auth.module';
import { MinioModule } from 'nestjs-minio-client';
import { CVController } from './controllers/cv.controller';
import { CVRepository } from './repos/cv.repository';
import { CVDomain } from './domain/cv.domain';
import { UserDomain } from './domain/user.domain';
import { UserController } from './controllers/user.controller';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    MinioModule.register({
      endPoint: process.env.MINIO_HOST,
      port: parseInt(process.env.MINIO_PORT,10),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT,10),
      },
    }),
    BullModule.registerQueue({
      name: "process-cv"
    })
  ],
  controllers: [AppController, AuthorizationController, CVController, UserController],
  providers: [AppService,
    UserRepository,
    CVRepository,
    PrismaService,
    AuthorizationDomain,
    CVDomain,
    UserDomain,
  ],
})
export class AppModule { }
