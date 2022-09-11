import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CVProcessor } from './cv.processor';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    }),
    MailModule
  ],
  controllers: [AppController],
  providers: [AppService, CVProcessor],
})
export class AppModule { }
