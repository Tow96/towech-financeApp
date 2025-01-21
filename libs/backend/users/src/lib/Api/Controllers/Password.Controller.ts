import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';

// Guards
import { RequestingUserGuard } from '../Guards/RequestingUser.Guard';

// Services
import { UserService } from '../../Core/Application/User.Service';

// Validation
import { ChangePasswordDto } from '../Validation/ChangePassword.Dto';
import { ResetPasswordDto } from '../Validation/ResetPassword.Dto';

@Controller('user-new/:userId/password')
export class PasswordController {
  constructor(private readonly _userService: UserService) {}

  @Patch('/')
  @UseGuards(RequestingUserGuard)
  async changePassword(
    @Param('userId') userId: string,
    @Body() data: ChangePasswordDto
  ): Promise<void> {
    return this._userService.changePassword(userId, data.oldPassword, data.newPassword);
  }

  @Post('/send-reset')
  async sendPasswordResetEmail(@Param('userId') userId: string): Promise<void> {
    return this._userService.generatePasswordResetCode(userId);
  }

  @Post('/reset')
  async resetPassword(
    @Param('userId') userId: string,
    @Body() data: ResetPasswordDto
  ): Promise<void> {
    return this._userService.resetPassword(userId, data.resetCode, data.newPassword);
  }
}
