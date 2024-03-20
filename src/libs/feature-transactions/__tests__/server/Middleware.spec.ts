// Libraries ------------------------------------------------------------------
import { ErrorResponse, Middleware } from '@/utils';
// Tested components ----------------------------------------------------------
import { canManageWallet } from '../../Middleware';
// Mocks ----------------------------------------------------------------------
import { mockRequest } from '@/utils/__mocks__/Request';
import { DynamicParams } from '@/utils';
import { stubWallet } from '../../__mocks__/DataAccessDb';
import { stubOwner, stubUser } from '@/libs/feature-authentication/__mocks__/DataAccessDb';

describe('canManageWallet', () => {
  describe('Given invalid data', () => {
    describe('- When there is no user header', () => {
      const req = mockRequest();
      test('- Then it should throw an unauthorized error', () => {
        expectUnauthorized(canManageWallet, req, { params: { walletId: stubWallet.id } });
      });
    });
    describe('- When there is no walletid', () => {
      const req = mockRequest({ headers: { user: JSON.stringify(stubOwner) } });
      test('- Then it should throw an unauthorized error', () => {
        expectUnauthorized(canManageWallet, req, {});
      });
    });
    describe('- When the wallet does not exist', () => {
      test('- Then it should return a not found error', () => {
        const req = mockRequest({ headers: { user: JSON.stringify(stubOwner) } });
        const response = async () =>
          await canManageWallet(req, { params: { walletId: 'I dont exist' } });
        expect(response).rejects.toThrow(new ErrorResponse('Not found', null, 404));
      });
    });
  });

  describe('Given a walletid', () => {
    const walletId = stubWallet.id;
    describe('- When the requesting user does not own the wallet', () => {
      const req = mockRequest({ headers: { user: JSON.stringify(stubUser) } });
      test('- Then it should throw a Forbidden error', () => {
        const response = async () => await canManageWallet(req, { params: { walletId } });
        expect(response).rejects.toThrow(new ErrorResponse('Forbidden', null, 403));
      });
    });

    describe('- When the requesting user owns the wallet', () => {
      const req = mockRequest({ headers: { user: JSON.stringify(stubOwner) } });
      test('- Then it should add the wallet to the headers', async () => {
        await canManageWallet(req, { params: { walletId } });
        expect(req.headers.get('wallet')).toBe(JSON.stringify(stubWallet));
      });
    });
  });
});

function expectUnauthorized(fn: Middleware, req: Request, params: DynamicParams) {
  const response = async () => await fn(req, params);
  expect(response).rejects.toThrow(new ErrorResponse('Unauthorized', null, 401));
}
