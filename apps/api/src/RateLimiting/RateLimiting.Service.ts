import { Provider } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

export const RateLimitingService: Provider = {
  provide: APP_GUARD,
  useClass: ThrottlerGuard,
};
