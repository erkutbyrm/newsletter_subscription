import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailPayloadDto } from 'src/email-confirmation/dtos/emailPayload.dto';
import VerificationTokenPayload from 'src/email-confirmation/interfaces/VerificationTokenPayload.interface';
import { MailerService } from 'src/mailer/services/mailer/mailer.service';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';




@Injectable()
export class EmailConfirmationService {

    private IV = randomBytes(16);
    
      
    constructor(
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
    ){}

    public async sendVerificationLink(emailPayload: EmailPayloadDto) {
        console.log(emailPayload.email);
        var email = emailPayload.email;
        var name = emailPayload.name;
        var surname = emailPayload.surname;
        /*
        const payload: VerificationTokenPayload = { email, name, surname };
        const token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        */

        const key = (await promisify(scrypt)(process.env.PASSWORD_AES, 'salt', 32)) as Buffer;

        const cipher = createCipheriv('aes-256-ctr', key, this.IV);
        let encrypted = cipher.update(email+";"+name+";"+surname, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        var encryptedTxt = encrypted.toString();
        console.log("enc: ", encryptedTxt);

        const decipher = createDecipheriv('aes-256-ctr', key, this.IV);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        var decryptedTxt = decrypted.toString();
        console.log("dec: ", decrypted.toString());


        //confirmation link, to be mailed to the users
        const url = `${process.env.EMAIL_CONFIRMATION_URL}?token=${encryptedTxt}`;
        const text = `Welcome ${name} ${surname} to the application. To confirm the email address, click here: ${url}`;
        console.log(url);
        //console.log(token);
        //console.log(payload);

        return this.mailerService.sendMail({
            from: "kafkalcom@outlook.com",
            to: email,
            subject: 'Email confirmation',
            text,
        });
    }

    public async decodeConfirmationToken(token: string) {
        const key = (await promisify(scrypt)(process.env.PASSWORD_AES, 'salt', 32)) as Buffer;
        const decipher = createDecipheriv('aes-256-ctr', key, this.IV);
        let decrypted = decipher.update(token, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        var decryptedTxt = decrypted.toString();
        console.log("dec in decode: ", decrypted.toString());

        let pos1 = decryptedTxt.indexOf(";");
        let pos2 = decryptedTxt.lastIndexOf(";");
        var email = decryptedTxt.substring(0,pos1);
        var name = decryptedTxt.substring(pos1+1, pos2);
        var surname = decryptedTxt.substring(pos2+1);
        
        var payload = {
            "email": email,
            "name": name,
            "surname": surname
        }
        return payload;

        /*
        try {
            const payload = await this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });
            if (typeof payload === 'object' && 'email' in payload) {
                console.log("confirmed", payload.email, payload.name, payload.surname)
                return payload;
            }
            throw new BadRequestException();
        } catch (error) {
            if (error?.name === 'TokenExpiredError') {
                throw new BadRequestException('Email confirmation token expired');
            }
            throw new BadRequestException('Bad confirmation token');
        }
        */
    }

}
