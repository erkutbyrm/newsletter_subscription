import { Body, Controller, Post } from '@nestjs/common';
import { CreateSubscriberDto } from 'src/subscribe/dtos/CreateSubscriber.dto';
import { SubscribeService } from 'src/subscribe/services/subscribe/subscribe.service';

@Controller('subscribe')
export class SubscribeController {
    constructor(
        private readonly subscribeService: SubscribeService
    ){}


    @Post()
    async createSubscriber(@Body() subscriberDetails: CreateSubscriberDto){
        return await this.subscribeService.saveSubscriber(subscriberDetails);
    }
}
