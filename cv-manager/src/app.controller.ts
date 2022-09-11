import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MinioService } from 'nestjs-minio-client';
import { AppService } from './app.service';
import { CV_BUCKET } from './constants';

@Controller()
@ApiTags('Home')
export class AppController implements OnModuleInit{
  
  constructor(private readonly appService: AppService,private readonly minioServ: MinioService) {}
  
  async onModuleInit(): Promise<void> {    
    const bucketExists = await this.minioServ.client.bucketExists(CV_BUCKET)
    if(!bucketExists){
        await this.minioServ.client.makeBucket(CV_BUCKET,'')
    }
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
