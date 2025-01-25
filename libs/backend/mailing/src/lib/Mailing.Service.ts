import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailgun from 'mailgun.js';
import MailGen from 'mailgen';

const FormData = require('form-data');

export type MailPayload = {
  to: string[] | string;
  subject: string;
  content: MailGen.Content;
};

@Injectable()
export class MailingService {
  private readonly MAILGUN_KEY = this._configService.getOrThrow<string>('MAILGUN_KEY');
  private readonly MAILGUN_DOMAIN = this._configService.getOrThrow<string>('MAILGUN_DOMAIN');
  private readonly mailClient = new Mailgun(FormData).client({
    username: 'api',
    key: this.MAILGUN_KEY,
  });

  private readonly FRONTEND_DASHBOARD =
    this._configService.getOrThrow<string>('FRONTEND_DASHBOARD');
  private readonly _mailGenerator = new MailGen({
    theme: 'salted',
    product: {
      name: 'Towech-FinanceApp',
      link: this.FRONTEND_DASHBOARD,
      //TODO: Create and add logo
    },
  });

  constructor(private readonly _configService: ConfigService) {}

  public async send(payload: MailPayload): Promise<void> {
    const html: string = this._mailGenerator.generate(payload.content);
    const text: string = this._mailGenerator.generatePlaintext(payload.content);

    await this.mailClient.messages.create(this.MAILGUN_DOMAIN, {
      from: `Towech Finance <no-reply@${this.MAILGUN_DOMAIN}>`,
      subject: payload.subject,
      to: payload.to,
      text,
      html,
    });
  }
}
