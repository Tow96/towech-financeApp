import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Common
import { DistributionProvider } from './common/distribution.provider';
import { IWalletRepository, PostgresWalletRepository } from './common/wallets';

// Features
import * as manageWallets from './feature/manage-wallets';

@Module({
  imports: [ConfigModule],
  controllers: [manageWallets.ManageWalletsController],
  providers: [
    // Common
    DistributionProvider,
    { provide: IWalletRepository, useClass: PostgresWalletRepository },

    // Features
    manageWallets.ArchiveWalletHandler,
    manageWallets.CreateWalletHandler,
    manageWallets.RestoreWalletHandler,
    manageWallets.UpdateWalletHandler,
    manageWallets.GetWalletOwnerHandler,
  ],
})
export class DistributionModule {}
