import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserCVInformation(email: string, username:string, filename:string, size:number, mimetype:string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Information about your CV',
      template: './processed-cv', 
      context: { 
        username,
        filename,
        size,
        mimetype
      },
    });
  }
}

