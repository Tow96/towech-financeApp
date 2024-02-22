// Libraries ------------------------------------------------------------------
// Tested components ----------------------------------------------------------
import { POST } from '@/app/api/users/route';
// Mocks ----------------------------------------------------------------------
import { mockRequest } from '@/utils/__mocks__/Request';

describe('/api/users', () => {
  describe('Given an unauthenticated user', () => {
    test('- Then an unauthorized response should be returned', async () => {
      const req = mockRequest();
      const response = await POST(req);

      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ errors: null, message: 'Unauthorized' });
    });
  });
});
