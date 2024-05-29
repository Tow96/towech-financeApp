// Libraries ------------------------------------------------------------------
// Tested components ----------------------------------------------------------
import { DELETE, GET, PUT } from '@/app/api/wallets/[walletid]/route';
// Mocks ----------------------------------------------------------------------
import { mockRequest } from '@/utils/__mocks__/Request';
import {
  MockTransactionsDb,
  stubUserWallet,
  stubWallet,
} from '../../../../libs/feature-transactions/__mocks__/DataAccessDb';
import { mockGetCookie } from '../../../../../jest/jest.server.setup';
jest.mock('../../../../libs/feature-transactions/DataAccessDb.ts', () => ({
  TransactionsDb: jest.fn().mockImplementation(() => MockTransactionsDb),
}));

describe('GET: /api/wallets/[walletid]', () => {
  validAndConfirmed(GET);
  describe('Given a valid walletid', () => {
    test('- Then it should return the wallet', () => {
      const req = mockRequest();
      mockGetCookie.mockImplementationOnce(() => ({ value: 'valid' }));
      expectResponse(GET, req, stubWallet.id, 200, {
        ...stubWallet,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});

describe('PUT: /api/wallets/[walletid]', () => {
  validAndConfirmed(PUT);
  describe('Given a body with no data', () => {
    const req = mockRequest({ body: { mal: 'formed' } });
    test('- Then it should return an unprocessable error', async () => {
      mockGetCookie.mockImplementationOnce(() => ({ value: 'valid' }));
      await expectResponse(PUT, req, stubWallet.id, 422, { message: 'No data', errors: null });
    });
  });
  // describe('Given an update to a name that already exists', () => {
  //   const req = mockRequest({ body: { name: stubWallet.name } });
  //   test('- Then it should return an unprocessable error', async () => {
  //     mockGetCookie.mockImplementationOnce(() => ({ value: 'valid' }));
  //     await expectResponse(PUT, req, stubWallet.id, 409, { message: 'Wallet already exists' });
  //   });
  // });
  describe('Given valid update data', () => {
    const name = 'what name';
    test('- Then it should return an unprocessable error', async () => {
      const req = mockRequest({ body: { name } });
      mockGetCookie.mockImplementationOnce(() => ({ value: 'valid' }));
      await expectResponse(PUT, req, stubWallet.id, 201, {
        ...stubWallet,
        name,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});

describe('DELETE: /api/wallets/[walletid]', () => {
  validAndConfirmed(DELETE);
  describe('Given a valid walletid', () => {
    test('- Then it should return a 204', () => {
      const req = mockRequest();
      mockGetCookie.mockImplementationOnce(() => ({ value: 'valid' }));
      expectResponse(DELETE, req, stubWallet.id, 204, undefined);
    });
  });
});

function validAndConfirmed(fn: (req: any, p?: any) => any) {
  describe('Given invalid credentials', () => {
    const req = mockRequest();
    test('- Then an unauthorized response should be returned', async () => {
      await expectResponse(fn, req, stubWallet.id, 401, { errors: null, message: 'Unauthorized' });
    });
  });
  describe('Given an user with an unconfirmed account', () => {
    test('- Then it should return a forbidden error', async () => {
      const req = mockRequest();
      mockGetCookie.mockImplementationOnce(() => ({ value: 'unconfirmed' }));
      await expectResponse(fn, req, stubWallet.id, 403, {
        errors: null,
        message: 'Account not confirmed',
      });
    });
  });
  describe('Given a request for a wallet with a different owner', () => {
    test('- Then it should return a forbidden error', async () => {
      const req = mockRequest();
      mockGetCookie.mockImplementationOnce(() => ({ value: 'valid' }));
      await expectResponse(fn, req, stubUserWallet.id, 403, { errors: {}, message: 'Forbidden' });
    });
  });
  describe('Given a request for a wallet that does not exist', () => {
    test('- Then it should return a not found error', async () => {
      const req = mockRequest();
      mockGetCookie.mockImplementationOnce(() => ({ value: 'valid' }));
      await expectResponse(fn, req, 'fakeWallet', 404, { errors: {}, message: 'Not found' });
    });
  });
}

async function expectResponse(
  fn: (req: any, p?: any) => any,
  req: Request,
  walletid: string,
  status: number,
  message: unknown
) {
  const response = await fn(req, { params: { walletid } });
  expect(response.status).toBe(status);
  if (message) expect(await response.json()).toEqual(message);
}
