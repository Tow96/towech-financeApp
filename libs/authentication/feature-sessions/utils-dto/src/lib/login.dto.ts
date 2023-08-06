/** login.dto.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Class Validator dto for the login body
 */
// Libraries
import { IsBoolean, IsString } from 'class-validator';
// Models
import { LoginUser } from '@finance/shared/utils-types';
// OpenAPi
import { ApiProperty } from '@nestjs/swagger';
// I18n
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginDto implements LoginUser {
  @IsString({
    message: i18nValidationMessage('validation.INVALID_STRING', { parameter: 'username' }),
  })
  @ApiProperty({ required: true })
  public username: string = '';

  @IsString({
    message: i18nValidationMessage('validation.INVALID_STRING', { parameter: 'password' }),
  })
  @ApiProperty({ required: true })
  public password: string = '';

  @IsBoolean()
  @ApiProperty({ description: 'True if the session is not temporary', required: true })
  public keepSession: boolean = false;
}
