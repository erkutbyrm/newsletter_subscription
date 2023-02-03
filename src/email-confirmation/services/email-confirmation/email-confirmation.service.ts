import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import VerificationTokenPayload from 'src/email-confirmation/interfaces/VerificationTokenPayload.interface';
import { MailerService } from 'src/mailer/services/mailer/mailer.service';


@Injectable()
export class EmailConfirmationService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
    ){}

    public sendVerificationLink(email: string) {
        console.log(email);
        const payload: VerificationTokenPayload = { email };
        const token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        //confirmation link, to be mailed to the users
        const url = `${process.env.EMAIL_CONFIRMATION_URL}?token=${token}`;
        const text = `Welcome to the application. To confirm the email address, click here: ${url}`;
        console.log(url);
        console.log(token);
        console.log(payload);

        return this.mailerService.sendMail({
            from: "kafkalcom@outlook.com",
            to: email,
            subject: 'Email confirmation',
            text,
        });
    }

    public async decodeConfirmationToken(token: string) {
        try {
            const payload = await this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });
            if (typeof payload === 'object' && 'email' in payload) {
                console.log("confirmed", payload.email)
                return payload.email;
            }
            throw new BadRequestException();
        } catch (error) {
            if (error?.name === 'TokenExpiredError') {
                throw new BadRequestException('Email confirmation token expired');
            }
            throw new BadRequestException('Bad confirmation token');
        }
    }

}
