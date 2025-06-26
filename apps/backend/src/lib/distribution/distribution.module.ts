import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Common
import { DistributionProvider } from './common/distribution.provider';
import { IWalletRepository, PostgresWalletRepository } from './common/wallets';

// Features

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [
    // Common
    DistributionProvider,
    { provide: IWalletRepository, useClass: PostgresWalletRepository },
  ],
})
export class DistributionModule {}
