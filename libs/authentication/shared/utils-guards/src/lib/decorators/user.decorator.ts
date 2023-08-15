/** user.decorator.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Decorator that extracts the user from the http request
 */
// Libraries
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModel } from '@finance/shared/utils-types';

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserModel | undefined => ctx.switchToHttp().getRequest().user
);
