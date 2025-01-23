import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';

// Guards
import { RequestingUserGuard } from '../Guards/RequestingUser.Guard';
import { AdminRequestingUserGuard } from '../Guards/AdminUser.Guard';

// Services
import { EmailVerificationCommands } from '../../Core/Application/Commands/EmailVerification.Commands';

// Validation
import { ChangeEmailDto } from '../Validation/ChangeEmail.Dto';
import { VerifyEmailDto } from '../Validation/VerifyEmail.Dto';

@Controller('user-new/:userId/email')
export class EmailController {
  constructor(private readonly _emailVerification: EmailVerificationCommands) {}

  @Patch('/')
  @UseGuards(RequestingUserGuard)
  async changeEmail(@Param('userId') userId: string, @Body() data: ChangeEmailDto): Promise<void> {
    return this._emailVerification.changeEmail(userId, data.email);
  }

  @Post('/send-verification')
  @UseGuards(AdminRequestingUserGuard)
  async sendVerificationEmail(@Param('userId') userId: string): Promise<void> {
    return this._emailVerification.generateEmailVerificationCode(userId);
  }

  @Post('/verify')
  async verifyEmail(@Param('userId') userId: string, @Body() data: VerifyEmailDto): Promise<void> {
    return this._emailVerification.verifyEmail(userId, data.token);
  }
}
