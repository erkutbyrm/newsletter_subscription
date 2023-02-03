import { Body, Controller, Post } from '@nestjs/common';
import { CreateSubscriberDto } from 'src/subscribe/dtos/CreateSubscriber.dto';
import { SubscribeService } from 'src/subscribe/services/subscribe/subscribe.service';

@Controller('subscribe')
export class SubscribeController {
    constructor(
        private readonly subscribeService: SubscribeService
    ){}


    @Post()
    createSubscriber(@Body() subscriberDetails: CreateSubscriberDto){
        var email = subscriberDetails.email;
        console.log("controller email:"+email);

        this.subscribeService.saveSubscriber(email);
        return "end of createSubscriber";
    }
}
