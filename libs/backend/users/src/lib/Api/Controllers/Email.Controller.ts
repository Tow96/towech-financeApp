import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';

// Guards
import { RequestingUserGuard } from '../Guards/RequestingUser.Guard';
import { AdminRequestingUserGuard } from '../Guards/AdminUser.Guard';

// Services
import { UserService } from '../../Core/Application/User.Service';

// Validation
import { ChangeEmailDto } from '../Validation/ChangeEmail.Dto';
import { VerifyEmailDto } from '../Validation/VerifyEmail.Dto';

@Controller('user-new/:userId/email')
export class EmailController {
  constructor(private readonly _userService: UserService) {}

  @Patch('/')
  @UseGuards(RequestingUserGuard)
  async changeEmail(@Param('userId') userId: string, @Body() data: ChangeEmailDto): Promise<void> {
    return this._userService.changeEmail(userId, data.email);
  }

  @Post('/send-verification')
  @UseGuards(AdminRequestingUserGuard)
  async sendVerificationEmail(@Param('userId') userId: string): Promise<void> {
    return this._userService.generateEmailVerificationCode(userId);
  }

  @Post('/verify')
  async verifyEmail(@Param('userId') userId: string, @Body() data: VerifyEmailDto): Promise<void> {
    return this._userService.verifyEmail(userId, data.token);
  }
}
