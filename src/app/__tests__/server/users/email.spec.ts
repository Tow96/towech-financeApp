// Libraries ------------------------------------------------------------------
// Tested components ----------------------------------------------------------
import { POST } from '@/app/api/users/email/route';
// Mocks ----------------------------------------------------------------------
import { mockRequest } from '@/utils/__mocks__/Request';
import { MockUsersDb } from '../../../../libs/feature-authentication/__mocks__/DataAccessDb';
jest.mock('../../../../libs/feature-authentication/DataAccessDb.ts', () => ({
  UsersDb: jest.fn().mockImplementation(() => MockUsersDb),
}));
const sendMailSpy = jest.fn();
jest.mock('../../../../utils/Mailer.ts', () => ({
  Mailer: jest.fn().mockImplementation(() => ({ sendRegistrationEmail: sendMailSpy })),
}));

describe('POST: /api/users/email', () => {
  describe('Given not valid credentials', () => {
    const req = mockRequest();
    test('- Then an unauthorized response should be returned', async () =>
      await expectResponse(req, 401, { errors: null, message: 'Unauthorized' }));
  });
  // describe('Given valid credentials', () => {
  //   test('- Then it should send an email with the validation token')
  // });
});

async function expectResponse(req: Request, status: number, message: unknown) {
  const response = await POST(req, {});
  expect(response.status).toBe(status);
  expect(await response.json()).toEqual(message);
}
