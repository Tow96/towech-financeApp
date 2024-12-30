import { Module } from '@nestjs/common';
import { LegacyModule } from '../legacy/legacy.module';
import { CqrsModule } from '@nestjs/cqrs';

import { ApplicationCommands, ApplicationQueries } from '../Core/Application/Configs/ApplicationUseCase.Registration';
import { PersistenceService } from '../Infrastructure/Persistence/Configs/PersistanceService.Registration';
import { PresentationControllers } from './Configs/Presentation.Registration';

@Module({
  imports: [LegacyModule, CqrsModule],
  controllers: [...PresentationControllers],
  providers: [...ApplicationCommands, ...ApplicationQueries, ...PersistenceService],
})
export class AppModule {}
