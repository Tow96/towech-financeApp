import { Module } from '@nestjs/common';
import { LegacyModule } from './legacy/legacy.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@financeapp/backend-users';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    LegacyModule,
    CqrsModule,
    UsersModule,
  ],
})
export class AppModule {}
