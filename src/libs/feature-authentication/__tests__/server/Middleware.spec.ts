// Libraries ------------------------------------------------------------------
import { ErrorResponse, Middleware } from '@/utils/MiddlewareHandler';
// Tested components ----------------------------------------------------------
import { isAuthenticated, isSuperUserOrAdmin } from '../../Middleware';
// Mocks ----------------------------------------------------------------------
import { mockRequest } from '@/utils/__mocks__/Request';
import { mockGetCookie } from '../../../../../jest/jest.server.setup';
import { stubOwner } from '../../__mocks__/DataAccessDb';
const superUserKey = 'SuperKey';

describe('isSuperUserOrAdmin', () => {
  beforeAll(() => (process.env.SUPERUSER_KEY = superUserKey));
  describe('Given an unauthenticated user', () => {
    const req = mockRequest();
    test('- Then an unauthorized error should be thrown', async () =>
      expectUnauthorized(isSuperUserOrAdmin, req));
  });
  describe('Given an invalid user', () => {
    const req = mockRequest({ headers: { Authorization: 'FAKE' } });
    test('-Then an unauthorized error should be thrown', async () =>
      expectUnauthorized(isSuperUserOrAdmin, req));
  });
});

describe('isCookieValid', () => {
  describe('Given no cookie', () => {
    const req = mockRequest();
    mockGetCookie.mockImplementationOnce(() => null);
    test('- Then an unauthorized error should be thrown', async () =>
      expectUnauthorized(isAuthenticated, req));
  });
  describe('Given an invalid/expired cookie', () => {
    const req = mockRequest();
    mockGetCookie.mockImplementationOnce(() => ({ value: 'false' }));
    test('- Then an unauthorized error should be thrown', async () =>
      expectUnauthorized(isAuthenticated, req));
  });
  describe('Given a valid cookie', () => {
    const req = mockRequest();
    mockGetCookie.mockImplementationOnce(() => ({ value: 'refresh' }));
    test('- Then it should set the user in the request headers', async () => {
      await isAuthenticated(req);
      expect(req.headers.get('user')).toBe(JSON.stringify(stubOwner));
    });
  });
});

function expectUnauthorized(fn: Middleware, req: Request) {
  const response = async () => await fn(req);
  expect(response).rejects.toThrow(new ErrorResponse('Unauthorized', null, 401));
}
