import { WalletAggregate } from './wallet.aggregate';

// Split into repository and querier
export abstract class IWalletRepository {
  abstract walletExists(userId: string, name: string): Promise<string | null>;
  abstract getWalletOwner(id: string): Promise<string | null>;
  abstract getById(id: string): Promise<WalletAggregate | null>;

  abstract saveChanges(aggregate: WalletAggregate): Promise<void>;
}
