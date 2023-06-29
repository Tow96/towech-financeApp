/** create-user-dto.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Class Validator dto for the createuser body
 */
// Libraries
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
// Models
import { CreateUser, UserRoles } from '@towech-finance/shared/utils/models';
// OpenAPi
import { ApiProperty } from '@nestjs/swagger';
// I18n
import { i18nValidationMessage } from 'nestjs-i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
const convertToRole = (input: any): UserRoles => {
  if (typeof input !== 'string') return UserRoles.USER;

  const lowerInput = input.toLowerCase();
  if (lowerInput === 'admin') return UserRoles.ADMIN;
  return UserRoles.USER;
};
/* eslint-enable */

export class CreateUserDto implements CreateUser {
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING', { parameter: 'name' }) })
  @MinLength(3, {
    message: i18nValidationMessage('validation.MIN_LENGTH', { parameter: 'name', count: 3 }),
  })
  @ApiProperty({ description: 'Name of the new user', required: true })
  public name: string;

  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_MAIL', { parameter: 'mail' }) })
  @ApiProperty({
    description: 'Email address of the user, it is also used as the username',
    required: true,
  })
  public mail: string;

  @IsOptional()
  @Transform(({ value }) => convertToRole(value))
  @ApiProperty({
    type: String,
    description: 'Role that the new user will take, defaults to USER',
    required: false,
  })
  public role: UserRoles = UserRoles.USER;
}
