import { CreateUser } from '@towech-finance/shared/utils/models';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

/* eslint-disable @typescript-eslint/no-explicit-any */
const convertToRole = (input: any): 'admin' | 'user' => {
  if (typeof input !== 'string') return 'user';

  const lowerInput = input.toLowerCase();
  if (lowerInput === 'admin') return 'admin';
  return 'user';
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
  role: 'admin' | 'user';
}
