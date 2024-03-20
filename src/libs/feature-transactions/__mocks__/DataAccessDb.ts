import { stubOwner, stubUser } from '@/libs/feature-authentication/__mocks__/DataAccessDb';
import { InsertWallet, UpdateWallet, Wallet } from '../Schema';

export const stubWallet: Wallet = {
  createdAt: new Date(),
  iconId: 0,
  id: '1234',
  money: 0,
  name: 'Wallet',
  updatedAt: new Date(),
  userId: stubOwner.id,
};
export const stubUserWallet: Wallet = {
  createdAt: new Date(),
  iconId: 0,
  id: '4321',
  money: 0,
  name: 'Wallet 2',
  updatedAt: new Date(),
  userId: stubUser.id,
};

const data: Wallet[] = [stubWallet, stubUserWallet];
export const MockTransactionsDb = {
  addWallet: (userId: string, wallet: InsertWallet): Wallet => ({
    createdAt: new Date(),
    iconId: 0,
    id: '09849',
    money: 0,
    updatedAt: new Date(),
    userId,
    ...wallet,
  }),
  getAllWallets: (userId: string) => data.filter(w => w.userId === userId),
  getWalletById: (id: string) => data.find(w => w.id === id) || null,
  getWalletByName: (name: string, userId: string) =>
    data.find(w => w.name === name && w.userId === userId) || null,
  updateWallet: (id: string, upd: UpdateWallet) => {
    const w = data.find(w => w.id === id);
    if (!w) return null;
    return { ...w, ...upd };
  },
  deleteWallet: (id: string) => (data.find(w => w.id === id) ? true : false),
};
