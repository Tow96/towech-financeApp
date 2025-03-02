import { Module } from '@nestjs/common';
import { MailingService } from './Mailing.Service';

@Module({
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingModule {}
