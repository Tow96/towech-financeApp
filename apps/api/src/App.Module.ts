import { Module } from '@nestjs/common';
import { LegacyModule } from './legacy/legacy.module';
import { CqrsModule } from '@nestjs/cqrs';

import { ApplicationCommands, ApplicationQueries } from '@financeApp/backend-application';
import { PersistenceService } from '@financeApp/backend-infrastructure-persistence';
import { ControllerRegistration } from './Controllers/Controller.Registration';

@Module({
  imports: [LegacyModule, CqrsModule],
  controllers: [...ControllerRegistration],
  providers: [...ApplicationCommands, ...ApplicationQueries, ...PersistenceService],
})
export class AppModule {}
