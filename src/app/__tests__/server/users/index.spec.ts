// Libraries ------------------------------------------------------------------
// Tested components ----------------------------------------------------------
import { POST } from '@/app/api/users/route';
// Mocks ----------------------------------------------------------------------
import { mockRequest } from '@/utils/__mocks__/Request';
import {
  MockUsersDb,
  stubOwner,
} from '../../../../libs/feature-authentication/__mocks__/DataAccessDb';
jest.mock('../../../../libs/feature-authentication/DataAccessDb.ts', () => ({
  UsersDb: jest.fn().mockImplementation(() => MockUsersDb),
}));
const sendMailSpy = jest.fn();
jest.mock('../../../../utils/Mailer.ts', () => ({
  Mailer: jest.fn().mockImplementation(() => ({ sendRegistrationEmail: sendMailSpy })),
}));

const superUserKey = 'SuperKey';

describe('POST: /api/users', () => {
  beforeAll(() => (process.env.SUPERUSER_KEY = superUserKey));
  describe('Given not valid credentials', () => {
    const req = mockRequest();
    test('- Then an unauthorized response should be returned', async () =>
      await expectResponse(req, 401, { errors: null, message: 'Unauthorized' }));
  });
  describe('Given valid credentials', () => {
    describe('- When invalid/malformed data is sent', () => {
      const req = mockRequest({
        headers: { Authorization: superUserKey },
        body: { mal: 'formed' },
      });
      test('- Then it should return an unprocessable error', async () =>
        await expectResponse(req, 422, expect.any(Object)));
    });
    describe('- When an already existing user is sent', () => {
      const req = mockRequest({
        headers: { Authorization: superUserKey },
        body: { email: stubOwner.email, name: 'name', role: 'user' },
      });
      test('- Then it should return a conflict error', async () =>
        await expectResponse(req, 409, { message: expect.any(String) }));
    });
    describe('- When a new user is sent', () => {
      const req = mockRequest({
        headers: { Authorization: superUserKey },
        body: { email: 'new@mail.com', name: 'name', role: 'user' },
      });
      test('- Then it should send an email with the password to the newly created user', async () => {
        sendMailSpy.mockClear();
        await POST(req, {});
        expect(sendMailSpy).toHaveBeenCalledTimes(1);
      });
      test('- Then it should return the newly created user', async () =>
        await expectResponse(req, 201, {
          accountConfirmed: false,
          createdAt: expect.any(String),
          email: 'new@mail.com',
          id: expect.any(String),
          name: 'name',
          role: 'user',
          updatedAt: expect.any(String),
        }));
    });
  });
});

async function expectResponse(req: Request, status: number, message: unknown) {
  const response = await POST(req, {});
  expect(response.status).toBe(status);
  expect(await response.json()).toEqual(message);
}
