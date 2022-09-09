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

@Module({
  imports: [AuthModule,  MinioModule.register({
    endPoint: '127.0.0.1',
    port: 9000,
    useSSL: false,
    accessKey: 'ROOTUSER',
    secretKey: 'CHANGEME123'
  })],
  controllers: [AppController, AuthorizationController, CVController],
  providers: [AppService, 
    UserRepository,
    CVRepository,
    PrismaService, 
    AuthorizationDomain,
    CVDomain,
  ],
})
export class AppModule {}
