import { Provider } from '@nestjs/common';
import {
  AuthenticationUserService,
  passwordStub,
  plainUserStub,
  userStub,
} from '@towech-finance/authentication/repos/user';
import { jest } from '@jest/globals';

const mockValues = {
  getByEmail: jest.fn((mail: string) => {
    if (mail === plainUserStub().mail) return plainUserStub();
    return null;
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