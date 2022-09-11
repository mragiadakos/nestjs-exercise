import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CVProcessor } from './cv.processor';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    MailModule,
    MinioModule.register({
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
    }),
    MailModule
  ],
  controllers: [AppController],
  providers: [AppService, CVProcessor],
})
export class AppModule { }
