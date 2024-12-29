import { Module } from '@nestjs/common';
import { LegacyModule } from '../legacy/legacy.module';

@Module({
  imports: [LegacyModule],
})
export class AppModule {}
