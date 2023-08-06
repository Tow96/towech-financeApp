// Libraries
import { Provider } from '@nestjs/common';
import { jest } from '@jest/globals';
// Services
import { AuthenticationSessionsUserService } from '@finance/authentication/feature-sessions/data-access-user';
// Stubs
import { passwordStub, plainAdminStub, plainUserStub, userStub } from './user.stub';
// Models
import { UserRoles } from '@finance/shared/utils-types';

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

  removeRefreshToken: jest.fn(),

  storeRefreshToken: jest.fn(),

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

export const AuthenticationSessionsUserServiceMock: Provider = {
  provide: AuthenticationSessionsUserService,
  useValue: mockValues,
};
