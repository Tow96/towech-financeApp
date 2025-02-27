import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  resetCode!: string;

  @IsNotEmpty()
  @IsString()
  newPassword!: string;
}
