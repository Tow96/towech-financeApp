// Libraries ------------------------------------------------------------------
import { DbError } from '@/utils/db';
// Tested components ----------------------------------------------------------
import { TransactionsModel } from '../../Model';
// Mocks ----------------------------------------------------------------------
import { stubOwner } from '@/libs/feature-authentication/__mocks__/DataAccessDb';
import { stubWallet } from '../../__mocks__/DataAccessDb';
import { InsertWallet } from '../../Schema';

const model = new TransactionsModel();

describe('TransactionsModel.createWallet', () => {
  describe('Given a wallet name that is already registered by the user', () => {
    test('- Then it should throw a db error', () => {
      const t = async () => model.createWallet(stubOwner.id, { name: stubWallet.name });
      expect(t).rejects.toThrow(new DbError('Wallet already exists'));
    });
  });
  describe('Given a new wallet', () => {
    const insWallet: InsertWallet = { name: 'New Wallet' };
    test('- Then it should create the wallet', async () => {
      const newWallet = await model.createWallet(stubOwner.id, insWallet);
      expect(newWallet).toEqual({
        id: expect.any(String),
        userId: stubOwner.id,
        iconId: 0,
        name: 'New Wallet',
        money: 0,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });
});

describe('TransactionModel.getAllWallets', () => {
  describe('Given any string as a user id', () => {
    test('- Then it should return all the wallets that the user owns', async () => {
      const wallets = await model.getAllWallets(stubOwner.id);
      expect(wallets).toEqual([stubWallet]);
    });
  });
});

describe('TransactionModel.getWallet', () => {
  describe('Given an unexistent wallet id', () => {
    test('- Then it should return null', async () => {
      const wallet = await model.getWallet('fake wallet id');
      expect(wallet).toBeNull();
    });
  });
  describe('Given an existent wallet id', () => {
    test('- Then it should return the wallet', async () => {
      const wallet = await model.getWallet(stubWallet.id);
      expect(wallet).toEqual(stubWallet);
    });
  });
});

describe('TransactionModel.updateWallet', () => {
  describe('Given an unexistent wallet id', () => {
    test('- Then it should throw a db error', async () => {
      const t = async () => model.updateWallet('fake wallet id', { name: 'Another' });
      expect(t).rejects.toThrow(new DbError('Wallet not found'));
    });
  });
  describe('Given an existent wallet id', () => {
    test('- Then it should return the updated wallet', async () => {
      const wallet = await model.updateWallet(stubWallet.id, { name: 'new name' });
      expect(wallet).toEqual({ ...stubWallet, name: 'new name' });
    });
  });
});
