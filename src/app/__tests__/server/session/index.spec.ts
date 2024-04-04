// Libraries ------------------------------------------------------------------
// Tested components ----------------------------------------------------------
import { DELETE, GET, POST } from '@/app/api/session/route';
// Mocks ----------------------------------------------------------------------
import { mockRequest } from '@/utils/__mocks__/Request';
import { mockGetCookie } from '../../../../../jest/jest.server.setup';
import { stubOwner } from '@/libs/feature-authentication/__mocks__/DataAccessDb';

describe('POST: /api/session', () => {
  describe('Given malformed credentials', () => {
    const req = mockRequest({ body: { mal: 'formed' } });
    test('- Then it should return an unprocessable error', async () =>
      await expectResponse(POST, req, 422, expect.any(Object)));
  });
  describe('Given invalid credentials', () => {
    const req = mockRequest({
      body: { email: 'false', password: 'invalid', keepSession: true },
    });
    test('- Then it should return an unauthorized error', async () =>
      await expectResponse(POST, req, 401, { message: 'Invalid credentials' }));
  });
  // describe('Given valid credentials', () => {
  //   const req = mockRequest({
  //     body: { email: stubOwner.email, password: stubPass, keepSession: true },
  //   });
  //   test('- Then it should return a session cookie', async () => {
  //     await expectResponse(req, 204, null);
  //   });
  // });
});

describe('GET: /api/session', () => {
  describe('Given no cookie or an invalid cookie', () => {
    const req = mockRequest();
    mockGetCookie.mockImplementationOnce(() => null);
    test('- Then it should return an unauthorized error', async () =>
      await expectResponse(GET, req, 401, { message: 'Unauthorized', errors: null }));
  });
  describe('Given a valid cookie', () => {
    const req = mockRequest();
    mockGetCookie.mockImplementationOnce(() => ({ value: 'valid' }));
    test('- Then it should return the user data', async () =>
      await expectResponse(GET, req, 200, {
        ...stubOwner,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }));
  });
});

describe('DELETE: /api/session', () => {
  describe('Given no cookie or an invalid cookie', () => {
    const req = mockRequest();
    mockGetCookie.mockImplementationOnce(() => null);
    test('- Then it should return an unauthorized error', async () =>
      await expectResponse(DELETE, req, 401, { message: 'Unauthorized', errors: null }));
  });
  describe('Given a valid cookie', () => {
    const req = mockRequest();
    mockGetCookie.mockImplementationOnce(() => ({ value: 'valid' }));
    test('- Then it should return the user data', async () =>
      await expectResponse(DELETE, req, 204, undefined));
  });
});

async function expectResponse(
  fn: (req: any, p?: any) => any,
  req: Request,
  status: number,
  message: unknown
) {
  const response = await fn(req);
  expect(response.status).toBe(status);
  if (response.body) {
    expect(await response.json()).toEqual(message);
  }
}
