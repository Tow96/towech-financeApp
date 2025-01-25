import * as MailGen from 'mailgen';
import { ConfigService } from '@nestjs/config';
import { MailingService } from '@financeapp/backend-mailing';
import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../Domain/Entities/User.Entity';

@Injectable()
export class UserEmailService {
  private readonly FRONTEND_DASHBOARD =
    this._configService.getOrThrow<string>('FRONTEND_DASHBOARD');
  private readonly FRONTEND_VERIFY_EMAIL =
    this._configService.getOrThrow<string>('FRONTEND_VERIFY_EMAIL');
  private readonly FRONTEND_RESET_PASS =
    this._configService.getOrThrow<string>('FRONTEND_RESET_PASS');
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
            color: '#FAB700',
            text: 'Dashboard',
            link: this.FRONTEND_DASHBOARD,
          },
        },
        outro:
          'We’re constantly working to improve the app, so if you have any suggestions or feedback, we’d love to hear from you.',
        signature: 'Cheers,',
      },
    };

    await this._mailing.send({ to: user.Email, content, subject: 'Welcome to Towech Finance!' });
  }

  public async sendVerificationEmail(user: UserEntity, code: string): Promise<void> {
    this._logger.log(`Sending verification email to  user: ${user.Id}`);
    const content: MailGen.Content = {
      body: {
        name: user.Name,
        intro: 'Thanks for being part of Towech Finance!',
        action: {
          instructions: `To verify your email address, please enter the following code in the app: ${code}.`,
          button: {
            color: '#FAB700',
            text: 'Verify email address',
            link: `${this.FRONTEND_VERIFY_EMAIL}${user.Id}?code=${code}`,
          },
        },
        outro: 'If you didn’t request this, please ignore this email or contact our support team.',
        signature: 'Cheers,',
      },
    };

    await this._mailing.send({
      to: user.Email,
      content,
      subject: 'Towech Finance App. Verify you email address.',
    });
  }

  public async sendEmailVerifiedEmail(user: UserEntity): Promise<void> {
    this._logger.log(`Sending email verified email to user: ${user.Id}`);
    const content: MailGen.Content = {
      body: {
        name: user.Name,
        intro: 'Your email has been successfully verified.',
        outro: 'If you didn’t request this, please ignore this email or contact our support team.',
        signature: 'Cheers,',
      },
    };

    await this._mailing.send({
      to: user.Email,
      content,
      subject: 'Towech Finance App. Email address verified.',
    });
  }

  public async sendPasswordResetEmail(user: UserEntity, code: string): Promise<void> {
    this._logger.log(`Sending password reset email to user: ${user.Id}`);
    const content: MailGen.Content = {
      body: {
        name: user.Name,
        intro: 'We have received a request to reset your password.',
        action: {
          instructions: `To reset your password, please enter the following code in the app: ${code}.`,
          button: {
            color: '#FAB700',
            text: 'Reset password',
            link: `${this.FRONTEND_RESET_PASS}${user.Id}?code=${code}`,
          },
        },
        outro: 'If you didn’t request this, please ignore this email or contact our support team.',
        signature: 'Cheers,',
      },
    };

    await this._mailing.send({
      to: user.Email,
      content,
      subject: 'Towech Finance App. Password reset',
    });
  }

  public async sendPasswordChangeEmail(user: UserEntity): Promise<void> {
    this._logger.log(`Sending password changed email for user: ${user.Id}`);
    const content: MailGen.Content = {
      body: {
        name: user.Name,
        intro:
          'Your password has been successfully changed.\nIf you did not make this change, please contact our support team immediately.',
        outro: 'Thanks for using our service!',
        signature: 'Cheers,',
      },
    };

    await this._mailing.send({
      to: user.Email,
      content,
      subject: 'Towech Finance App. Password changed',
    });
  }
}
