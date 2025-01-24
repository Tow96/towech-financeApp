import * as MailGen from 'mailgen';
import { ConfigService } from '@nestjs/config';
import { MailingService } from '@financeapp/backend-mailing';
import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../Domain/Entities/User.Entity';

@Injectable()
export class UserEmailService {
  private readonly FRONTEND_URL = this._configService.getOrThrow<string>('MAIL_LINK_URL');
  private readonly _logger = new Logger('UserEmailService');

  constructor(private _configService: ConfigService, private readonly _mailing: MailingService) {}

  public async sendRegistrationEmail(user: UserEntity): Promise<void> {
    this._logger.log(`Sending registration email to  user: ${user.Id}`);
    const content: MailGen.Content = {
      body: {
        name: user.Name,
        intro: 'Welcome to Towech Finance! We’re so excited to have you on board.',
        action: {
          instructions: 'To help you get started, you can go to your dashboard.',
          button: {
            color: '#22BC66',
            text: 'Dashboard',
            link: this.FRONTEND_URL,
          },
        },
        outro:
          'We’re constantly working to improve the app, so if you have any suggestions or feedback, we’d love to hear from you.',
        signature: 'Cheers, The TowechLabs Team',
      },
    };

    await this._mailing.send({ to: user.Email, content, subject: 'Welcome to Towech Finance!' });
  }
}
