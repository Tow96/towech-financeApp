import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailgun from 'mailgun.js';
import MailGen from 'mailgen';
import { IMailgunClient } from 'mailgun.js/Interfaces/MailgunClient/IMailgunClient';

const FormData = require('form-data');

export type MailPayload = {
  to: string[] | string;
  subject: string;
  content: MailGen.Content;
};

@Injectable()
export class MailingService {
  private readonly MAILGUN_KEY = this._configService.get<string>('MAILGUN_KEY') || '';
  private readonly MAILGUN_DOMAIN = this._configService.get<string>('MAILGUN_DOMAIN') || '';
  private readonly FRONTEND_DASHBOARD = this._configService.get<string>('FRONTEND_DASHBOARD') || '';

  private readonly _logger = new Logger(MailingService.name);
  private readonly _mailClient: IMailgunClient | undefined;
  private readonly _mailGenerator: MailGen | undefined;
  private readonly _enabled: boolean = true;

  constructor(private readonly _configService: ConfigService) {
    if (this.MAILGUN_KEY === '' || this.MAILGUN_DOMAIN === '' || this.FRONTEND_DASHBOARD === '') {
      this._logger.warn(`Environment variables for mailing are missing, disabling mail service`);
      this._enabled = false;
      return;
    }

    this._mailClient = new Mailgun(FormData).client({ username: 'api', key: this.MAILGUN_KEY });
    this._mailGenerator = new MailGen({
      theme: 'salted',
      product: { name: 'Towech-FinanceApp', link: this.FRONTEND_DASHBOARD },
      //TODO: Create and add logo
    });
  }

  public async send(payload: MailPayload): Promise<void> {
    if (!this._enabled) {
      this._logger.warn(`Mailing is disabled`);
      return;
    }

    const html: string = this._mailGenerator?.generate(payload.content);
    const text: string = this._mailGenerator?.generatePlaintext(payload.content);

    await this._mailClient?.messages.create(this.MAILGUN_DOMAIN, {
      from: `Towech Finance <no-reply@${this.MAILGUN_DOMAIN}>`,
      subject: payload.subject,
      to: payload.to,
      text,
      html,
    });
  }
}
