// Libraries ------------------------------------------------------------------
// Tested components ----------------------------------------------------------
import { ZodError } from 'zod';
import { Wallet, InsertWallet, UpdateWallet } from '../../Schema';

describe('InsertWallet', () => {
  describe('Given a malformed name', () => {
    describe('When it is an invalid type', () => {
      const testData = { icon_id: 22 };
      test('- Then it should throw an error when parsed', () => {
        const t = () => InsertWallet.parse(testData);
        expect(t).toThrow(
          new ZodError([
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'undefined',
              path: ['name'],
              message: 'Required',
            },
          ])
        );
      });
    });
    describe('When it is longer than 50 characters', () => {
      const testData = {
        name: 'this is wallet name with a length superior to 50 characters',
        icon_id: 22,
      };
      test('- Then it should throw an error when parsed', () => {
        const t = () => InsertWallet.parse(testData);
        expect(t).toThrow(
          new ZodError([
            {
              code: 'too_big',
              maximum: 50,
              type: 'string',
              inclusive: true,
              exact: false,
              message: 'String must contain at most 50 character(s)',
              path: ['name'],
            },
          ])
        );
      });
    });
  });
  describe('Given a valid but unformatted data', () => {
    const testData = { name: ' name  ' };
    test('- Then it should format the data properly', () => {
      const result = InsertWallet.parse(testData);
      expect(result).toEqual({ name: 'name' });
    });
  });
});

describe('UpdateWallet', () => {
  describe('Given a valid but unformatted data', () => {
    const testData = { pepe: 'test' };
    test('- Then it should format the data properly', () => {
      const result = UpdateWallet.parse(testData);
      expect(result).toEqual({});
    });
  });
});

describe('Wallet', () => {
  describe('Given the data from the db', () => {
    const receivedData = {
      id: '1',
      userId: '2',
      iconId: 0,
      name: 'Wallet',
      money: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false,
    };

    describe('- Then it should omit the deleted column', () => {
      const wallet = Wallet.parse(receivedData);
      expect(wallet).toEqual({ ...receivedData, deleted: undefined });
    });
  });
});
