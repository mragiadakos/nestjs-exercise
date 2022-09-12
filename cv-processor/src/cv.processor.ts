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
    constructor(private readonly minioServ: MinioService,private mailService: MailService) {
        dynamicImport('file-type').then(ft => this.ft=ft)
    }

    @Process('cv')
    async handleCV(job: Job) {
        const { bucket, objectName, filename, username, email } = job.data;
        const objStream = await this.minioServ.client.getObject(bucket, objectName)
        const chunks = []
        for await (let chunk of objStream) {
            chunks.push(chunk)
        }
        const buf = Buffer.concat(chunks)
        const size = buf.length
        const mimeObj = await this.ft.fileTypeFromBuffer(buf);
        await this.mailService.sendUserCVInformation(email, username,filename,size,mimeObj.mime);
    }
}