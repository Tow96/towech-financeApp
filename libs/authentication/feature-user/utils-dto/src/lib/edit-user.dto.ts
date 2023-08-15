/** edit-user.dto.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Class Validator dto for the edituser body
 */
// Libraries
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
// Models
import { EditUser } from '@finance/shared/utils-types';
// OpenAPi
import { ApiProperty } from '@nestjs/swagger';
// I18n
import { i18nValidationMessage } from 'nestjs-i18n';

export class EditUserDto implements EditUser {
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING', { parameter: 'name' }) })
  @MinLength(3, {
    message: i18nValidationMessage('validation.MIN_LENGTH', { parameter: 'name', count: 3 }),
  })
  @ApiProperty({ description: 'Name of the new user' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_MAIL', { parameter: 'mail' }) })
  @ApiProperty({
    description: 'Email address of the user, it is also used as the username',
  })
  mail?: string;
}
