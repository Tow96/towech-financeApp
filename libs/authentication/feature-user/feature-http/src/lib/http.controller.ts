/** http.controller.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Controller for the routes that handle changes to the user
 */
// Libraries
import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Patch,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
// Services
import { ConfigService } from '@nestjs/config';
import { LogId, AuthenticationPidWinstonLogger } from '@finance/authentication/shared/logger';
// Guards
import { JwtAuthGuard } from '@finance/authentication/shared/utils-guards';

@Controller()
@ApiTags('')
// TODO: I18n
export class AuthenticationUserHttpController {
  @UseGuards(JwtAuthGuard)
  @Patch('')
  @ApiOperation({ summary: 'Make changes to the user that makes the call' })
  @ApiBearerAuth('access-token')
  editUser(): void {
    throw new Error('Not yet implemented');
  }

  constructor(private readonly config: ConfigService) {}
}
