import { Module } from '@nestjs/common';
import { LegacyModule } from './legacy/legacy.module';
import { CqrsModule } from '@nestjs/cqrs';

import { ApplicationCommands, ApplicationQueries } from '@financeApp/backend-application';
import { PersistenceModule } from '@financeApp/backend-infrastructure-persistence';
import { LoggingModule } from '@financeApp/backend-infrastructure-logging';
import { ControllerRegistration } from './Controllers/Controller.Registration';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    LegacyModule,
    CqrsModule,
    PersistenceModule,
    LoggingModule,
  ],
  controllers: [...ControllerRegistration],
  providers: [...ApplicationCommands, ...ApplicationQueries],
})
export class AppModule {}
