import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerModule } from 'src/mailer/mailer.module';
import { MailerService } from 'src/mailer/services/mailer/mailer.service';
import { EmailConfirmationController } from './controllers/email-confirmation/email-confirmation.controller';
import { EmailConfirmationService } from './services/email-confirmation/email-confirmation.service';

@Module({
  imports: [MailerModule],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService, JwtService, MailerService]
})
export class EmailConfirmationModule {}
