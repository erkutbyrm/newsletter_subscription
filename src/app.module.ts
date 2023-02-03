import { Module } from '@nestjs/common';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import { ConfigModule } from '@nestjs/config';
import { SubscribeModule } from './subscribe/subscribe.module';

@Module({
  imports: [EmailConfirmationModule, ConfigModule.forRoot(), SubscribeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
