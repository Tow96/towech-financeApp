/** log-id.decorator.ts
 * Copyright (c) 2022, Towechlabs
 *
 * Decorator that extracts the logId from the http request
 */
// Libraries
import { createParamDecorator } from '@nestjs/common';

export const LogId = createParamDecorator((data, req): string => {
  return req.args[0].logId;
});
