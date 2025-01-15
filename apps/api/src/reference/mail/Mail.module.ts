import { Module } from '@nestjs/common';
import { SendGridClient } from './SendGrid.client';

@Module({
  providers: [SendGridClient],
  exports: [],
})
export class MailModule {}
