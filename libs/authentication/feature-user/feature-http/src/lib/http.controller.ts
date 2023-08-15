/** http.controller.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Controller for the routes that handle changes to the user
 */
// Libraries
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Patch,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
// Services
import { LogId, AuthenticationPidWinstonLogger } from '@finance/authentication/shared/logger';
import { AuthenticationUserService } from '@finance/authentication/shared/data-access-user';
// Guards
import { JwtAuthGuard, User } from '@finance/authentication/shared/utils-guards';
// Models
import { EditUserDto } from '@finance/authentication/feature-user/utils-dto';
import { UserModel } from '@finance/shared/utils-types';

@Controller()
@ApiTags('')
// TODO: I18n
export class AuthenticationUserHttpController {
  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiOperation({ summary: 'Make changes to the user that makes the call' })
  @ApiBearerAuth('access-token')
  async editUser(
    @User() user: UserModel,
    @Body() data: EditUserDto,
    @LogId() logId: string
  ): Promise<UserModel | null> {
    this.logger.pidLog(logId, `Updating user: ${user._id}`);
    if (Object.keys(data).length === 0) {
      this.logger.pidLog(logId, `No data to update`);
      throw new UnprocessableEntityException('validation.NO_DATA');
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    try {
      const updatedUser = await this.user.edit(user._id, data);
      this.logger.pidLog(logId, 'Successfully updated the data');

      // if (updatedUser && !updatedUser.accountConfirmed) {
      //   // TODO: Send mail if needed;
      // }
      return updatedUser;
    } catch (e: any) {
      throw new HttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    /* eslint-enable */
  }

  constructor(
    private readonly logger: AuthenticationPidWinstonLogger,
    private readonly user: AuthenticationUserService
  ) {}
}
