import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { MinioService } from "nestjs-minio-client";
import { MailService } from "./mail/mail.service";

// reference https://jaywolfe.dev/how-to-use-es-modules-with-older-node-js-projects-the-right-way/
const dynamicImport = async (packageName: string) =>
  new Function(`return import('${packageName}')`)();


@Processor('process-cv')
export class CVProcessor {
    private ft: any;
    constructor(private readonly minioServ: MinioService,private mailService: MailService) {}

    @Process('cv')
    async handleCV(job: Job) {
        const { bucket, objectName, filename, mimetype, username, email } = job.data;
        console.log(bucket, filename)
        if(!this.ft){
            this.ft =  await dynamicImport('file-type')
        }
        const objStream = await this.minioServ.client.getObject(bucket, objectName)
        const size = objStream.readableLength
        const mimeObj = await this.ft.fileTypeFromStream(objStream);
        console.log(size, mimeObj)
        await this.mailService.sendUserCVInformation(email, username,filename,size,mimeObj.mime);
        console.log('send')
    }
}