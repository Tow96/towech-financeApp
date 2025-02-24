import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

// Guards
import { AdminRequestingUserGuard } from '../Guards/AdminUser.Guard';

// Services
import { EmailVerificationCommands } from '../../Core/Application/Commands/EmailVerification.Commands';

// Validation
import { VerifyEmailDto } from '../Validation/VerifyEmail.Dto';

@Controller('users/email')
export class EmailController {
  constructor(private readonly _emailVerification: EmailVerificationCommands) {}

  @Post('/send-verification/:userId')
  @UseGuards(AdminRequestingUserGuard)
  async sendVerificationEmail(@Param('userId') userId: string): Promise<void> {
    return this._emailVerification.generateEmailVerificationCode(userId);
  }

  @Post('/verify')
  async verifyEmail(@Body() data: VerifyEmailDto): Promise<void> {
    return this._emailVerification.verifyEmail(data.email, data.code);
  }
}
