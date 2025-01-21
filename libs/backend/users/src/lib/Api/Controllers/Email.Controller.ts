import { Body, Controller, Logger, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { ChangeEmailDto } from '../Validation/ChangeEmail.Dto';
import { VerifyEmailDto } from '../Validation/VerifyEmail.Dto';
import { RequestingUserGuard } from '../Guards/RequestingUser.Guard';
import { AdminRequestingUserGuard } from '../Guards/AdminUser.Guard';
import { EmailVerificationService } from '../../Core/Application/EmailVerification.Service';

@Controller('user-new/:userId/email')
export class EmailController {
  private readonly _logger = new Logger(EmailController.name);
  constructor(private readonly _emailVerificationService: EmailVerificationService) {}

  @Patch('/')
  @UseGuards(RequestingUserGuard)
  async changeEmail(@Param('userId') userId: string, @Body() data: ChangeEmailDto): Promise<void> {
    this._emailVerificationService.changeEmail(userId, data.email);
  }

  @Post('/send-verification')
  @UseGuards(AdminRequestingUserGuard)
  async sendVerificationEmail(@Param('userId') userId: string): Promise<void> {
    const code = this._emailVerificationService.generateVerificationToken(userId);
    this._logger.verbose(`CODE: ${code}`);

    // TODO: Send email with code
    return;
  }

  @Post('/verify')
  async verifyEmail(@Param('userId') userId: string, @Body() data: VerifyEmailDto): Promise<void> {
    return this._emailVerificationService.verifyEmail(userId, data.token);
  }
}
// 116
