import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';

// Guards
import { RequestingUserGuard } from '../Guards/RequestingUser.Guard';

// Services
import { PasswordResetCommands } from '../../Core/Application/Commands/PasswordReset.Commands';

// Validation
import { ChangePasswordDto } from '../Validation/ChangePassword.Dto';
import { ResetPasswordDto } from '../Validation/ResetPassword.Dto';

@Controller('users/password')
export class PasswordController {
  constructor(private readonly _passwordReset: PasswordResetCommands) {}

  @Patch('/:userId')
  @UseGuards(RequestingUserGuard)
  async changePassword(
    @Param('userId') userId: string,
    @Body() data: ChangePasswordDto
  ): Promise<void> {
    return this._passwordReset.changePassword(userId, data.oldPassword, data.newPassword);
  }

  @Post('/send-reset')
  async sendPasswordResetEmail(@Body() data: { email: string }): Promise<void> {
    return this._passwordReset.generatePasswordResetCode(data.email);
  }

  @Post('/reset')
  async resetPassword(@Body() data: ResetPasswordDto): Promise<void> {
    return this._passwordReset.resetPassword(data.email, data.resetCode, data.newPassword);
  }
}
