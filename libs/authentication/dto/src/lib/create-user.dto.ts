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

/* eslint-disable @typescript-eslint/no-explicit-any */
const convertToRole = (input: any): UserRoles => {
  if (typeof input !== 'string') return UserRoles.USER;

  const lowerInput = input.toLowerCase();
  if (lowerInput === 'admin') return UserRoles.ADMIN;
  return UserRoles.USER;
};
/* eslint-enable */

// TODO: I18n
export class CreateUserDto implements CreateUser {
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least three characters long' })
  @ApiProperty({ description: 'Name of the new user', required: true })
  name: string;

  @IsString({ message: 'Email must be a valid address' })
  @IsEmail()
  @ApiProperty({
    description: 'Email address of the user, it is also used as the username',
    required: true,
  })
  mail: string;

  @IsOptional()
  @Transform(({ value }) => convertToRole(value))
  @ApiProperty({
    type: String,
    description: 'Role that the new user will take, defaults to USER',
    required: false,
  })
  role: UserRoles;
}
