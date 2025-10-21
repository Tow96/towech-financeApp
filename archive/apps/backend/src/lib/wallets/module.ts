import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/lib/database';

import { WalletController } from './controller';
import { WalletRepository } from './repository';

@Module({
  imports: [DatabaseModule],
  controllers: [WalletController],
  providers: [WalletRepository],
})
export class WalletModule {}
