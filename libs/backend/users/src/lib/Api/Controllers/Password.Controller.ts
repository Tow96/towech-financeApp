import { Body, Controller, Logger, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { ChangePasswordDto } from '../Validation/ChangePassword.Dto';
import { ResetPasswordDto } from '../Validation/ResetPassword.Dto';
import { RequestingUserGuard } from '../Guards/RequestingUser.Guard';
import { UserInfoService } from '../../Core/Application/UserInfo.Service';
import { PasswordService } from '../../Core/Application/Password.Service';

@Controller('user-new/:userId/password')
export class PasswordController {
  private readonly _logger = new Logger(PasswordController.name);
  constructor(
    private readonly _userInfoService: UserInfoService,
    private readonly _passwordService: PasswordService
  ) {}

  @Patch('/')
  @UseGuards(RequestingUserGuard)
  async changePassword(
    @Param('userId') userId: string,
    @Body() data: ChangePasswordDto
  ): Promise<void> {
    return this._userInfoService.changePassword(userId, data.oldPassword, data.newPassword);
  }

  @Post('/send-reset')
  async sendPasswordResetEmail(@Param('userId') userId: string): Promise<void> {
    const code = await this._passwordService.generatePasswordResetCode(userId);
    this._logger.verbose(`CODE: ${code}`);

    // TODO: Send email with code
    return;
  }

  @Post('/reset')
  async resetPassword(
    @Param('userId') userId: string,
    @Body() data: ResetPasswordDto
  ): Promise<void> {
    return this._passwordService.resetPassword(userId, data.resetCode, data.newPassword);
  }
}
