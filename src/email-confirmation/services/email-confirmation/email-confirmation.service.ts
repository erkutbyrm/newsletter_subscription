import { BadRequestException, Injectable } from '@nestjs/common';
import { EmailPayloadDto } from 'src/email-confirmation/dtos/emailPayload.dto';
import { MailerService } from 'src/mailer/services/mailer/mailer.service';
import { createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class EmailConfirmationService {
    //initialize iv with given hex value
    private IV = Buffer.from(`${process.env.HEX_VAL_FOR_IV}`,"hex");
    constructor(
        private readonly mailerService: MailerService,
    ){}

    async encryptAES(plainText: string){
        const key = (await promisify(scrypt)(process.env.PASSWORD_AES, 'salt', 32)) as Buffer;
        const cipher = createCipheriv('aes-256-ctr', key, this.IV);
        let encrypted = cipher.update(plainText, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted.toString();
    }

    async decryptAES(cipherText: string){
        const key = (await promisify(scrypt)(process.env.PASSWORD_AES, 'salt', 32)) as Buffer;
        const decipher = createDecipheriv('aes-256-ctr', key, this.IV);
        let decrypted = decipher.update(cipherText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted.toString();
    }

    public async sendVerificationLink(emailPayload: EmailPayloadDto) {

        var email = emailPayload.email;
        var name = emailPayload.name;
        var surname = emailPayload.surname;

        //aes encryption
        const encryptTime = new Date();
        var encryptedTxt = await this.encryptAES(`${email};${name};${surname};${encryptTime}`)

        //confirmation link, to be mailed to the users
        const url = `${process.env.EMAIL_CONFIRMATION_URL}?token=${encryptedTxt}`;
        const text = `Hello ${name} ${surname},\n Welcome to the application. To confirm the email address, click here:\n${url}`;

        return this.mailerService.sendMail({
            from: "kafkalcom@outlook.com",
            to: email,
            subject: 'Email confirmation',
            text,
        });
    }

    parseTxt(decryptedTxt: string){
        var decArr = decryptedTxt.split(";");
        return {email:decArr[0],  name: decArr[1], surname:decArr[2], issueDate: new Date(decArr[3])};
    }

    public async decodeConfirmationToken(token: string) {
        //aes decryptiion
        var decryptedTxt = await this.decryptAES(token);

        //parse information coming from decryption
        var {email, name, surname, issueDate} = this.parseTxt(decryptedTxt);
        //find the time passed since the verification link is generated
        const decryptTime = new Date();
        var timePassed = decryptTime.getTime()-issueDate.getTime();

        if(timePassed > parseInt(process.env.AES_EXPIRE_TIME)){
            throw BadRequestException; //change exception!!!!
        }
        //construct payload
        var payload = {
            "email": email,
            "name": name,
            "surname": surname
        };
        return payload;
    }
}
