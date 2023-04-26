import { Provider } from '@nestjs/common';
import {
  AuthenticationUserService,
  passwordStub,
  plainAdminStub,
  plainUserStub,
  userStub,
} from '@towech-finance/authentication/repos/user';
import { jest } from '@jest/globals';
import { UserRoles } from '@towech-finance/shared/utils/models';

/* eslint-disable @typescript-eslint/no-unused-vars*/
const mockValues = {
  getByEmail: jest.fn((mail: string) => {
    if (mail === plainUserStub().mail) return plainUserStub();
    return null;
  }),

  getById: jest.fn((id: string) => {
    if (id.toString() === plainUserStub()._id.toString()) return plainUserStub();
    if (id.toString() === plainAdminStub()._id.toString()) return plainAdminStub();
    return null;
  }),

  register: jest.fn((name: string, password: string, mail: string, role: UserRoles) => {
    if (mail.toString() !== plainUserStub().mail) throw new Error('ERROR');
    return plainUserStub();
  }),

  validatePassword: jest.fn((id: string, password: string) => {
    return id.toString() === plainUserStub()._id.toString() && password === passwordStub();
  }),

  validateRefreshToken: jest.fn((id: string, token: string) => {
    const valid =
      id.toString() === plainUserStub()._id &&
      (userStub().refreshTokens.includes(token) || userStub().singleSessionToken === token);

    return valid ? plainUserStub() : null;
  }),
};

export const AuthUserRepoMock: Provider = {
  provide: AuthenticationUserService,
  useValue: mockValues,
};
