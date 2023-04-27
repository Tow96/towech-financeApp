/** user.decorator.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Decorator that extracts the user from the http request
 */
// Libraries
import { createParamDecorator } from '@nestjs/common';
import { UserModel } from '@towech-finance/shared/utils/models';

export const User = createParamDecorator((data, req): UserModel => req.args[0].user);
