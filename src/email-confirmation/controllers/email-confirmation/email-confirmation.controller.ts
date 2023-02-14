import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import axios from 'axios';
import { EmailPayloadDto } from 'src/email-confirmation/dtos/emailPayload.dto';
import { EmailConfirmationService } from 'src/email-confirmation/services/email-confirmation/email-confirmation.service';

@Controller('email-confirmation')
export class EmailConfirmationController {
    constructor(
        private readonly emailConfirmationService: EmailConfirmationService,
    ) { }

    async postReqToSubscribe(postPayload) {
        return await axios.post(
            process.env.SUBSCRIBE_URL,
            postPayload,
            {}
        )
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return err;
            });
    }

    @Post("register")
    async sendMail(@Body() payload: EmailPayloadDto) {
        return await this.emailConfirmationService.sendVerificationLink(payload);
    }

    @Get("confirm")
    async confirm(@Query() query): Promise<any> {
        try {
            const { email, name, surname } = await this.emailConfirmationService.decodeConfirmationToken(query.token);

            var subscribePayload = {
                "email": email,
                "name": name,
                "surname": surname
            };

            return await this.postReqToSubscribe(subscribePayload);

        } catch (error) {
            return "Your token has expired";
        }



    }
}
