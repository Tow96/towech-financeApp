// Libraries ------------------------------------------------------------------
import { ErrorResponse } from '@/utils/MiddlewareHandler';
// Tested components ----------------------------------------------------------
import { isSuperUserOrAdmin } from '../..';
// Mocks ----------------------------------------------------------------------
import { mockRequest } from '@/utils/__mocks__/Request';

describe('/api/users', () => {
  describe('Given an unauthenticated user', () => {
    test('- Then an unauthorized error should be thrown', async () => {
      const req = mockRequest();
      const response = async () => await isSuperUserOrAdmin(req);

      expect(response).rejects.toThrow(new ErrorResponse('Unauthorized', null, 401));
    });
  });
});
