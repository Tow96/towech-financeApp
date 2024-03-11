import { MockUsersDb, stubOwner } from '@/libs/feature-authentication/__mocks__/DataAccessDb';

jest.mock('oslo/crypto', () => ({
  generateRandomString: (s: string) => s,
  alphabet: () => [],
}));
jest.mock('oslo/password', () => ({
  Argon2id: jest.fn(),
}));
jest.mock('lucia', () => ({
  verifyRequestOrigin: (origin: string, hosts: string[]) => hosts.includes(origin),
}));
jest.mock('../src/libs/feature-authentication/DataAccessDb.ts', () => ({
  UsersDb: jest.fn().mockImplementation(() => MockUsersDb),
}));
jest.mock('../src/libs/feature-authentication/Auth.ts', () => ({
  lucia: {
    createSession: (id: string) => ({
      id: 'sessionid',
      userId: id,
      fresh: true,
      expiresAt: Date(),
    }),
    createSessionCookie: (id: string) => ({
      name: 'auth_session',
      value: id,
      attributes: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 2592000,
      },
    }),
    createBlankSessionCookie: () => ({
      name: 'auth_session',
      value: '',
      attributes: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      },
    }),
    invalidateUserSessions: () => {},
    invalidateSession: () => {},
    validateSession: (id: string) => {
      if (id == 'valid')
        return {
          user: stubOwner,
          session: { id, userId: stubOwner.id, fresh: false, expiresAt: new Date() },
        };
      if (id == 'refresh')
        return {
          user: stubOwner,
          session: { id, userId: stubOwner.id, fresh: true, expiresAt: new Date() },
        };
      return { user: null, session: null };
    },
  },
}));

export const mockGetCookie = jest.fn((): null | { value: string } => null);
jest.mock('next/headers', () => ({
  cookies: () => ({ get: mockGetCookie, set: () => {} }),
}));
