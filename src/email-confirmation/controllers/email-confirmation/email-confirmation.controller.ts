import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import axios from 'axios';
import { EmailPayloadDto } from 'src/email-confirmation/dtos/emailPayload.dto';
import { EmailConfirmationService } from 'src/email-confirmation/services/email-confirmation/email-confirmation.service';
import { createDecipheriv } from 'crypto';

@Controller('email-confirmation')
export class EmailConfirmationController {
    constructor(
        private readonly emailConfirmationService: EmailConfirmationService,
    ) { }

    @Post("register")
    async sendMail(@Body() payload: EmailPayloadDto) {
        console.log("inside register");
        await this.emailConfirmationService.sendVerificationLink(payload);
        return;
    }

    @Get("confirm")
    async confirm(@Query() query): Promise<any> {
        console.log("inside confirm query");
        const {email, name, surname} = await this.emailConfirmationService.decodeConfirmationToken(query.token);


        var subscribePayload = {
            "email": email,
            "name": name,
            "surname": surname
        };
        console.log("payload:");
        console.log(subscribePayload);

        return axios.post(
            process.env.SUBSCRIBE_URL,
            subscribePayload,
            {}
        )
        .then((res) => {
            console.log("res data",res.data);
            return "response is:" +res.data;
        })
        .catch((err)=>{
            console.log(err);
            return err;
        });

    }
}
