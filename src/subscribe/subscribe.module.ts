import { Module } from '@nestjs/common';
import { SubscribeController } from './controllers/subscribe/subscribe.controller';
import { SubscribeService } from './services/subscribe/subscribe.service';

@Module({
  controllers: [SubscribeController],
  providers: [SubscribeService]
})
export class SubscribeModule {}
