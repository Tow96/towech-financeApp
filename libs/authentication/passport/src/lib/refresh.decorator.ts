/** refresh.decorator.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Decorator that extracts the refreshToken information from the http request
 */
import { createParamDecorator } from '@nestjs/common';
import { RefreshToken } from '@towech-finance/shared/utils/models';

export const Refresh = createParamDecorator((data, req): RefreshToken => req.args[0].user);
