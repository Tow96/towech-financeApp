// Libraries ------------------------------------------------------------------
// Tested components ----------------------------------------------------------
import { GET, POST } from '@/app/api/wallets/route';
// Mocks ----------------------------------------------------------------------
import { mockRequest } from '@/utils/__mocks__/Request';
import {
  MockTransactionsDb,
  stubWallet,
} from '../../../../libs/feature-transactions/__mocks__/DataAccessDb';
import { mockGetCookie } from '../../../../../jest/jest.server.setup';
jest.mock('../../../../libs/feature-transactions/DataAccessDb.ts', () => ({
  TransactionsDb: jest.fn().mockImplementation(() => MockTransactionsDb),
}));

describe('POST: /api/wallets', () => {
  validAndConfirmed(POST);
  describe('Given a body with invalid/malformed data', () => {
    const req = mockRequest({ body: { mal: 'formed' } });
    test('- Then it should return an unprocessable error', async () => {
      mockGetCookie.mockImplementationOnce(() => ({ value: 'valid' }));
      await expectResponse(POST, req, 422, expect.any(Object));
    });
  });
  describe('Given a wallet with same same name as an existing one', () => {
    const req = mockRequest({ body: { name: stubWallet.name } });
    test('- Then it should return a conflict error', async () => {
      mockGetCookie.mockImplementationOnce(() => ({ value: 'valid' }));
      await expectResponse(POST, req, 409, { message: expect.any(String) });
    });
  });
  describe('Given a new wallet', () => {
    const walletName = 'Truly new wallet';
    const req = mockRequest({ body: { name: walletName } });
    test('- Then it should return the newly created wallet', async () => {
      mockGetCookie.mockImplementationOnce(() => ({ value: 'valid' }));
      await expectResponse(POST, req, 201, {
        createdAt: expect.any(String),
        iconId: 0,
        id: expect.any(String),
        money: 0,
        name: walletName,
        updatedAt: expect.any(String),
        userId: expect.any(String),
      });
    });
  });
});

describe('GET: /api/wallets', () => {
  validAndConfirmed(GET);
  describe('Given valid credentials', () => {
    const req = mockRequest();
    test('- Then it should return all the wallets belonging to the user', async () => {
      mockGetCookie.mockImplementationOnce(() => ({ value: 'valid' }));
      await expectResponse(GET, req, 200, [
        { ...stubWallet, createdAt: expect.any(String), updatedAt: expect.any(String) },
      ]);
    });
  });
});

function validAndConfirmed(fn: (req: any, p?: any) => any) {
  describe('Given invalid credentials', () => {
    const req = mockRequest();
    test('- Then an unauthorized response should be returned', async () => {
      await expectResponse(fn, req, 401, { errors: null, message: 'Unauthorized' });
    });
  });
  describe('Given an user with an unconfirmed account', () => {
    test('- Then it should return a forbidden error', async () => {
      const req = mockRequest();
      mockGetCookie.mockImplementationOnce(() => ({ value: 'unconfirmed' }));
      await expectResponse(fn, req, 403, { errors: null, message: 'Account not confirmed' });
    });
  });
}

async function expectResponse(
  fn: (req: any, p?: any) => any,
  req: Request,
  status: number,
  message: unknown
) {
  const response = await fn(req, {});
  expect(response.status).toBe(status);
  expect(await response.json()).toEqual(message);
}
