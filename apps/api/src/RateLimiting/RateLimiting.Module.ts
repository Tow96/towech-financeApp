import { DynamicModule } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

export const RateLimitingModule: DynamicModule = ThrottlerModule.forRoot([
  {
    name: 'short',
    ttl: 1000,
    limit: 1,
  },
  {
    name: 'medium',
    ttl: 10000,
    limit: 2,
  },
  {
    name: 'long',
    ttl: 60000,
    limit: 10,
  },
]);
