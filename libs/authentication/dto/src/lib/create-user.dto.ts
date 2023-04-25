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

/* eslint-disable @typescript-eslint/no-explicit-any */
const convertToRole = (input: any): UserRoles => {
  if (typeof input !== 'string') return UserRoles.USER;

  const lowerInput = input.toLowerCase();
  if (lowerInput === 'admin') return UserRoles.ADMIN;
  return UserRoles.USER;
};
/* eslint-enable */

// TODO: I18n
// TODO: Swagger
export class CreateUserDto implements CreateUser {
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least three characters long' })
  name: string;

  @IsString({ message: 'Email must be a valid address' })
  @IsEmail()
  mail: string;

  @IsOptional()
  @Transform(({ value }) => convertToRole(value))
  role: UserRoles;
}
