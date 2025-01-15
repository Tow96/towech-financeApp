import { Injectable } from '@nestjs/common';
import { SendGridClient } from './SendGrid.client';
import { MailDataRequired } from '@sendgrid/mail';

@Injectable()
export class UserMailService {
  constructor(private readonly client: SendGridClient) {}

  async sendRegistrationMail(): Promise<void> {
    const mail: MailDataRequired = {
      to: 'jose.towe@gmail.com',
      from: 'finance@towechlabs.com',
      subject: 'Test email',
      replyTo: 'no-reply@towechlabs.com',
      content: [{ type: 'text/plain', value: 'This is a test mail' }],
    };
    await this.client.send(mail);
  }
}
