/** login.dto.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Class Validator dto for the login body
 */

import { LoginUser } from '@towech-finance/shared/utils/models';
import { IsBoolean } from 'class-validator';
// OpenAPi
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto implements LoginUser {
  @ApiProperty({ required: true })
  public username: string;

  @ApiProperty({ required: true })
  public password: string;

  @IsBoolean()
  @ApiProperty({ description: 'True if the session is not temporary', required: true })
  public keepSession: boolean;
}
