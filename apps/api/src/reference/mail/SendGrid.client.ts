import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService, MailDataRequired } from '@sendgrid/mail';

@Injectable()
export class SendGridClient {
  private client: MailService = new MailService();

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('SEND_GRID_KEY');
    this.client.setApiKey(apiKey);
  }

  async send(mail: MailDataRequired) {
    const transport = await this.client.send(mail);
    // avoid this on production. use log instead :)
    console.log(`E-Mail sent to ${mail.to}`);
    return transport;
  }
}
