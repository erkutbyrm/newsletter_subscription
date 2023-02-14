import { Body, Controller, Post } from '@nestjs/common';
import { CreateSubscriberDto } from 'src/subscribe/dtos/CreateSubscriber.dto';
import { SubscribeService } from 'src/subscribe/services/subscribe/subscribe.service';

@Controller('subscribe')
export class SubscribeController {
    constructor(
        private readonly subscribeService: SubscribeService
    ){}

    @Post('useinbox')
    async createSubscriberUIB(@Body() subscriberDetails: CreateSubscriberDto){
        return await this.subscribeService.saveSubscriberUIBX(subscriberDetails);
    }

    @Post('mailchimp')
    async createSubscriberMCP(@Body() subscriberDetails: CreateSubscriberDto){
        return await this.subscribeService.saveSubscriberMCP(subscriberDetails);
    }
}
