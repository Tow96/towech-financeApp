import { Module } from '@nestjs/common';
import { LegacyModule } from './legacy/legacy.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@financeapp/backend-users';
import { LoggingModule } from './Logging/Logging.Module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ScheduleModule.forRoot(),
    LegacyModule,
    LoggingModule,
    UsersModule,
  ],
})
export class AppModule {}
