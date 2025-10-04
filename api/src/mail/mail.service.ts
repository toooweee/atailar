import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { EnvService } from '../env/env.service';
import * as Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailService {
  private readonly nodemailerTransport: Mail;

  constructor(private readonly envService: EnvService) {
    this.nodemailerTransport = createTransport({
      service: this.envService.get('EMAIL_SERVICE'),
      auth: {
        user: this.envService.get('EMAIL_USER'),
        pass: this.envService.get('EMAIL_PASSWORD'),
      },
    });
  }

  sendEmail(options: Mail.Options): Promise<any> {
    return this.nodemailerTransport.sendMail(options);
  }
}
