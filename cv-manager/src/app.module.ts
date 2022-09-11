import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorizationController } from './controllers/authorization.controller';
import { UserRepository } from './repos/user.repository';
import { PrismaService } from './prisma/prisma.service';
import { AuthorizationDomain } from './domain/authorization.domain';
import { AuthModule } from './auth/auth.module';
import { MinioModule, MinioService } from 'nestjs-minio-client';
import { CVController } from './controllers/cv.controller';
import { CVRepository } from './repos/cv.repository';
import { CVDomain } from './domain/cv.domain';
import { UserDomain } from './domain/user.domain';
import { UserController } from './controllers/user.controller';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [AuthModule, MinioModule.register({
    endPoint: '127.0.0.1',
    port: 9000,
    useSSL: false,
    accessKey: 'ROOTUSER',
    secretKey: 'CHANGEME123'
  }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
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
