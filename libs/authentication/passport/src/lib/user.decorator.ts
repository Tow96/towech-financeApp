/** user.decorator.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Decorator that extracts the user from the http request
 */
// Libraries
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModel } from '@towech-finance/shared/utils/models';

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserModel | undefined => ctx.switchToHttp().getRequest().user
);
