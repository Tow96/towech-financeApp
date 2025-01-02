import { Module } from '@nestjs/common';
import { LegacyModule } from './legacy/legacy.module';
import { CqrsModule } from '@nestjs/cqrs';

import { ApplicationCommands, ApplicationQueries } from '@financeApp/backend-application';
import { PersistenceModule } from '@financeApp/backend-infrastructure-persistence';
import { ControllerRegistration } from './Controllers/Controller.Registration';

@Module({
  imports: [LegacyModule, CqrsModule, PersistenceModule],
  controllers: [...ControllerRegistration],
  providers: [...ApplicationCommands, ...ApplicationQueries],
})
export class AppModule {}
