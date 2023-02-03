import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import axios from 'axios';
import { EmailPayloadDto } from 'src/email-confirmation/dtos/emailPayload.dto';
import { EmailConfirmationService } from 'src/email-confirmation/services/email-confirmation/email-confirmation.service';

@Controller('email-confirmation')
export class EmailConfirmationController {
    constructor(
        private readonly emailConfirmationService: EmailConfirmationService,
    ) { }

    @Post("register")
    async sendMail(@Body() payload: EmailPayloadDto) {
        console.log("inside register");
        await this.emailConfirmationService.sendVerificationLink(payload.email);
        return;
    }

    @Get("confirm")
    async confirm(@Query() query): Promise<any> {
        console.log("inside confirm query");
        const email = await this.emailConfirmationService.decodeConfirmationToken(query.token);

        var subscribePayload = {
            "email": email
        };
        console.log("payload:");
        console.log(subscribePayload);

        axios.post(
            process.env.SUBSCRIBE_URL,
            subscribePayload,
            {}
        )
        .then((res) => {
            console.log(res);
            return "SUCCESSFULLY SUBSCRIBED TO THE MAILLIST";
        })
        .catch((err)=>{
            console.log(err);
            return "AN ERROR OCCURRED";
        });

    }
}
