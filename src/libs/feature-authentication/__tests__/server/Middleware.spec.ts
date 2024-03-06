// Libraries ------------------------------------------------------------------
import { ErrorResponse } from '@/utils/MiddlewareHandler';
// Tested components ----------------------------------------------------------
import { isSuperUserOrAdmin } from '../..';
// Mocks ----------------------------------------------------------------------
import { mockRequest } from '@/utils/__mocks__/Request';

const superUserKey = 'SuperKey';

describe('/api/users', () => {
  beforeAll(() => (process.env.SUPERUSER_KEY = superUserKey));
  describe('Given an unauthenticated user', () => {
    const req = mockRequest();
    test('- Then an unauthorized error should be thrown', async () => expectUnauthorized(req));
  });
  describe('Given an invalid user', () => {
    const req = mockRequest({ headers: { Authorization: 'FAKE' } });
    test('-Then an unauthorized error should be thrown', async () => expectUnauthorized(req));
  });
});

function expectUnauthorized(req: Request) {
  const response = async () => await isSuperUserOrAdmin(req);
  expect(response).rejects.toThrow(new ErrorResponse('Unauthorized', null, 401));
}
