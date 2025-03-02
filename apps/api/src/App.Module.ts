import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from '@financeapp/backend-users';
import { LegacyModule } from './legacy/legacy.module';
import { LoggingModule } from './Logging/Logging.Module';
// import { RateLimitingModule } from './RateLimiting/RateLimiting.Module';
// import { RateLimitingService } from './RateLimiting/RateLimiting.Service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    // RateLimitingModule,
    LoggingModule,

    LegacyModule,
    UsersModule,
  ],
  // providers: [RateLimitingService],
})
export class AppModule {}
