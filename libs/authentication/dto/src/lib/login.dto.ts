/** login.dto.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Class Validator dto for the login body
 */

import { LoginUser } from '@towech-finance/shared/utils/models';
import { IsBoolean } from 'class-validator';

export class LoginDto implements LoginUser {
  username: string;
  password: string;

  @IsBoolean()
  keepSession: boolean;
}
