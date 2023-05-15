/** log-id.decorator.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Decorator that extracts the logId from the http request
 */
// Libraries
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const LogId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => ctx.switchToHttp().getRequest().logId || 'NO-LOGID'
);
