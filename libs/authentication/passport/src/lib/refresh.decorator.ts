/** refresh.decorator.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Decorator that extracts the refreshToken information from the http request
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RefreshToken } from '@towech-finance/shared/utils/models';

export const Refresh = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): RefreshToken | undefined =>
    ctx.switchToHttp().getRequest().user
);
