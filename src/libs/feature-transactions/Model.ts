/** model.ts
 * Copyright (c) 2024, Towechlabs
 *
 * Class that handles how the model should behave,
 * It makes the necessary sb calls for it to work properly
 */
// Libraries ------------------------------------------------------------------
import { TransactionsDb } from './DataAccessDb';
import { InsertWallet, UpdateWallet, Wallet } from './Schema';
import { DbError } from '@/utils';

export class TransactionsModel {
  private db = new TransactionsDb();

  createWallet = async (userId: string, wallet: InsertWallet): Promise<Wallet> => {
    const walletExists = await this.db.getWalletByName(wallet.name, userId);
    if (walletExists) throw new DbError('Wallet already exists');

    return this.db.addWallet(userId, wallet);
  };

  getAllWallets = async (userId: string): Promise<Wallet[]> => this.db.getAllWallets(userId);

  getWallet = async (walletId: string): Promise<Wallet | null> => this.db.getWalletById(walletId);

  updateWallet = async (walletId: string, updateWallet: UpdateWallet): Promise<Wallet | null> => {
    const wallet = await this.db.getWalletById(walletId);
    if (!wallet) throw new DbError('Wallet not found');

    const walletExists = await this.db.getWalletByName(updateWallet.name || '', wallet.userId);
    if (walletExists) throw new DbError('Wallet already exists');
    return this.db.updateWallet(walletId, updateWallet);
  };

  deleteWallet = async (walletId: string): Promise<boolean> => this.db.deleteWallet(walletId);
}
