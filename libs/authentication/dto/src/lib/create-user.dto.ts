import { CreateUser } from '@towech-finance/shared/utils/models';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

const convertToRole = (input: string): 'admin' | 'user' => {
  const lowerInput = input.toLowerCase();
  if (lowerInput === 'admin') return 'admin';
  return 'user';
};

// TODO: I18n
// TODO: Swagger
export class CreateUserDto implements CreateUser {
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least three characters long' })
  name: string;

  @IsString({ message: 'Email must be a valid address' })
  @IsEmail()
  mail: string;

  @IsString({ message: 'Role must be a string' })
  @Transform(({ value }) => convertToRole(value))
  role: 'admin' | 'user';
}
