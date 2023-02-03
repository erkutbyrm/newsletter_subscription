import { Injectable } from '@nestjs/common';
import * as Mail from 'nodemailer/lib/mailer';
import { createTransport } from 'nodemailer';

@Injectable()
export class MailerService {
    private nodemailerTransport: Mail;
    
    constructor(){
        this.nodemailerTransport = createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    sendMail(options: Mail.Options) {
        return this.nodemailerTransport.sendMail(options);
    }
}
