import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MainProvider } from '@/lib/database/main.provider';

@Module({
  imports: [ConfigModule],
  providers: [MainProvider],
  exports: [MainProvider],
})
export class DatabaseModule {}
